import os
from datetime import datetime
from flask import request, abort
from functools import wraps
import jwt

"""
this value is used to determine the expiration date of the access token.
clients are expected to refresh their access token after expiration.
here it's set to a low value of 60 seconds for testing purposes.
ideally it should be much longer.
"""
access_token_validity_in_seconds = 60


"""
secret value to sign jwt tokens
"""
jwt_secret = os.environ.get("JWT_SECRET", "default jwt secret value")


"""
when used as a function decorator to an api endpoint,
acts as a middleware to check http headers for a valid access token.
if the access token is ok it calls the endpoint with a user identifier.
if a valid access token cannot be found it aborts the request with 401 status code.
"""
def authenticate(action):
    @wraps(action)
    def decorator(*args, **kwargs):
        auth_header = None
        # bearer token expected: Authorization: Bearer <token>
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
        if not auth_header:
            abort(401, 'access_token_missing')
        else:
            auth_parts = auth_header.split(' ')
            if len(auth_parts) != 2:
                abort(401, 'access_token_invalid')
            else:
                jwt_token = auth_parts[1]
                if len(jwt_token) == 0:
                    abort(401, 'access_token_invalid')
                else:
                    user_id = None
                    
                    try:
                        jwt_decoded = jwt.decode(jwt_token, jwt_secret, algorithms=["HS256"])
                        user_id = jwt_decoded["sub"]
                    except:
                        abort(401, "access_token_invalid")
                    
                    return action(user_id, *args, **kwargs)
    return decorator


"""
generates an access token as a signed jwt that contains user identifier and expiration.
"""
def generate_access_token(userid):
    iat = int(datetime.now().timestamp())
    exp = iat + access_token_validity_in_seconds
    jwt_token = {
        "sub": userid,
        "iat": iat,
        "exp": exp 
    }
    encoded_jwt = jwt.encode(jwt_token, jwt_secret, algorithm="HS256")
    return encoded_jwt
