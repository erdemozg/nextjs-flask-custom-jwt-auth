import uuid
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from auth import authenticate, generate_access_token
import business as business

app = Flask(__name__)

"""
enables cross-origin requests.
"""
CORS(app, supports_credentials=True)

"""
stores refresh tokens and their corresponding user objects.
ideally this data should be in an independent cache like redis or a database.
here it's implemented as an in-memory dictionary for simplicity.
"""
refresh_tokens = {}


"""
jsonify 400 responses and include error message.
"""
@app.errorhandler(400)
def custom401(error):
    response = jsonify({"ok": False, "message": error.description})
    response.status_code = 400
    return response


"""
jsonify 401 responses and include error message.
"""
@app.errorhandler(401)
def custom401(error):
    response = jsonify({"ok": False, "message": error.description})
    response.status_code = 401
    return response


"""
jsonify 403 responses and include error message.
"""
@app.errorhandler(403)
def custom403(error):
    response = jsonify({"ok": False, "message": error.description})
    response.status_code = 403
    return response


"""
api endpoint to create a new user.
"""
@app.route("/signup", methods=["POST"])
def signup():
    user_info = request.get_json()
    if user_info:
        ok, error_message = business.create_user(user_info["username"], user_info["password"])
        if ok:
            return jsonify({"ok": True})
        else:
            abort(403, error_message)
    else:
        abort(400, "bad_request")


"""
api endpoint for user login.
if credentials are valid it returns a user object containing access token.
it also issues a http-only "refresh_token" cookie.
clients are expected to call refresh token endpoint with this cookie present in order to obtain a new access token.
if credentials are invalid an error message is returned with a proper status code.
"""
@app.route("/login", methods=["POST"])
def login():
    user_info = request.get_json()
    if user_info:
        ok, user_id = business.check_user_credentials(user_info["username"], user_info["password"])
        if ok:
            user = business.get_user_by_id(user_id)
            encoded_jwt = generate_access_token(user["id"])
            
            user_return_object = {
                "id": user["id"],
                "username": user["username"],
                "access_token": encoded_jwt
            }
            
            refresh_token = uuid.uuid4().hex
            refresh_tokens[refresh_token] = user_return_object
            
            resp = jsonify(user_return_object)
            resp.set_cookie("refresh_token", refresh_token, httponly = True)
            return resp
        else:
            abort(401, "check_credentials")
    else:
        abort(400, "bad_request")


"""
api endpoint for logging out.
removes refresh token from in-memory dict and clears refresh_token cookie.
"""
@app.route("/logout", methods=["GET"])
def logout():
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token is not None and refresh_token in refresh_tokens:
        refresh_tokens.pop(refresh_token)
    resp = jsonify({"ok": True})
    resp.set_cookie("refresh_token", "", httponly = True, expires=0)
    return resp


"""
api endpoint for refreshing access token.
if a valid refresh token value is present in refresh_token cookie, it returns a user object containing a new access token.
it also removes the current refresh token, creates a new one and sets refresh_token cookie accordingly.
if something's wrong with refresh_token cookie or its value, http status code 401 is returned.
"""
@app.route("/refresh_token", methods=["GET"])
def refresh_token():
    refresh_token = request.cookies.get("refresh_token")

    if refresh_token is None:
        abort(401, "refresh_token_missing")
    elif refresh_token not in refresh_tokens:
        abort(401, "refresh_token_invalid")
    else:
        user_object = refresh_tokens[refresh_token]
        encoded_jwt = generate_access_token(user_object["id"])
        
        user_return_object = {
            "id": user_object["id"],
            "username": user_object["username"],
            "access_token": encoded_jwt
        }
        
        new_refresh_token = uuid.uuid4().hex
        refresh_tokens[new_refresh_token] = user_return_object
        refresh_tokens.pop(refresh_token, None)

        resp = jsonify(user_return_object)
        resp.set_cookie("refresh_token", new_refresh_token, httponly = True)
        return resp


"""
api endpoint for fetching profile info.
requires authentication.
this function is executed only if a valid access token is present in request headers.
"""
@app.route("/profile", methods=["GET"])
@authenticate
def profile(user_id):
    user = business.get_user_by_id(user_id)
    return jsonify(user)


"""
make sure that the database schema is created and start the app.
"""
if __name__ == "__main__":
    business.create_db_schema()
    app.run(debug=True, host="0.0.0.0", port=5000)
