import os
import sqlite3
import hashlib


"""
folder to create sqlite db file inside.
"""
DB_FOLDER = os.environ.get("DB_FOLDER", ".")


"""
create a db connection.
"""
def _get_db_connection():
    db_path = os.path.join(DB_FOLDER, 'db.sqlite3')
    conn = sqlite3.connect(db_path)
    return conn


"""
create the db schema.
"""
def create_db_schema():
    conn = _get_db_connection()

    users_sql = """
        CREATE TABLE IF NOT EXISTS users
        (
            id integer PRIMARY KEY,
            username text NOT NULL,
            password text NOT NULL
        )"""
    conn.execute(users_sql)

    conn.commit()
    conn.close()


"""
query a user with user id.
return user dict if found, none otherwise.
"""
def get_user_by_id(user_id):
    conn = _get_db_connection()
    cur = conn.cursor()
    query = """
        select 
            id,
            username
        from 
            users
        where
            id=:user_id"""
    cur.execute(query, {"user_id": user_id})
    ret = [
        {
            'id': id, 
            'username': username
        }
        for 
            id,
            username
        in cur.fetchall()
    ]
    conn.close()
    if len(ret) > 0:
        return ret[0]
    else:
        return None


"""
check user credentials and return true and user id if they are ok, false and none otherwise.
"""
def check_user_credentials(username, password):
    conn = _get_db_connection()
    cur = conn.cursor()
    query = """
        select 
            id
        from 
            users
        where
            username=:username
            and password=:password"""
    cur.execute(query, {"username": username, "password": hashlib.sha512(password.encode('utf-8')).hexdigest()})
    ret = [{ "id": id } for id in cur.fetchall()]
    conn.close()
    if len(ret) > 0:
        return True, ret[0]["id"][0]
    else:
        return False, None


"""
query a user with username.
return user dict if found, none otherwise.
"""
def get_user_by_username(username):
    conn = _get_db_connection()
    cur = conn.cursor()
    query = """
        select 
            id,
            username
        from 
            users
        where
            username=:username"""
    cur.execute(query, {"username": username})
    ret = [
        {
            'id': id, 
            'username': username
        }
        for 
            id,
            username
        in cur.fetchall()
    ]
    conn.close()
    if len(ret) > 0:
        return ret[0]
    else:
        return None


"""
create a new user with specified info.
if username is already taken return false and error message.
if everything is ok return true and none.
"""
def create_user(username, password):
    existing_user = get_user_by_username(username)
    if existing_user is not None:
        return False, "user_already_exists"
    conn = _get_db_connection()
    cur = conn.cursor()
    query = """
        insert into users(
            username,
            password
        )
        values (?, ?)
    """
    cur.execute(
        query, 
        (
            username,
            hashlib.sha512(password.encode('utf-8')).hexdigest()
        )
    )
    conn.commit()
    conn.close()
    return True, None
