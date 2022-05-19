from app import db
from app.models import User
import json
from sqlalchemy import exists


def user_exist(username):
    return db.session.query(exists().where(User.username == username)).scalar()


def get_user_id_by_name(username):
    return User.query.filter_by(username=username).first().id


def add_or_update_user(name, rf_token, token):
    if user_exist(name):
        update_user_token(name, rf_token, token)
    else:
        add_user(name, rf_token, token)
    return get_user(name)


def update_user_token(name, rf_token, token):
    if not user_exist(name):
        return "wrong name"
    u = get_user(name)
    u.refresh_token = rf_token
    u.token = token
    db.session.commit()
    return "success!"


def add_user(name, rf_token="", token=""):
    if user_exist(name):
        return None
    u = User(username=name, refresh_token=rf_token, token=token)
    # u.set_password(password)
    db.session.add(u)
    db.session.commit()
    return u


def delete_user(name):
    if not user_exist(name):
        return "wrong name"
    # Markup.query.filter_by(user_id=get_user_id_by_name(name)).delete()
    User.query.filter_by(username=name).delete()
    db.session.commit()
    return "success!"


def get_user(username):
    return User.query.filter_by(username=username).first()


def get_all_users():
    return [a.username for a in User.query.all()]
