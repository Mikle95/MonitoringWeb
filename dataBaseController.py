from app import db
from app.models import User
import json
from sqlalchemy import exists


def user_exist(username):
    return db.session.query(exists().where(User.username == username)).scalar()


def get_user_id_by_name(username):
    return User.query.filter_by(username=username).first().id


def update_user_token(name, token):
    if not user_exist(name):
        return "wrong name"
    u = get_user(name)
    u.refresh_token = token
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


# def project_exist(pname):
#     return db.session.query(exists().where(Project.pname == pname)).scalar()
#
#
# def markup_exist(username, pname):
#     user_id = get_user_id_by_name(username)
#     return Markup.query.filter_by(user_id=user_id, filename=pname).count() > 0


# def get_projects(user_id):
#     if user_id == None:
#         return [a.pname for a in Project.query.all()]
#     else:
#         return [a.filename for a in Markup.query.filter_by(user_id=user_id)]


# def test_projects_names():
#     data = ["SomeProject1", "SomeProject2", "My Test Project"]
#     return json.dumps(data)


# def add_new_user_project(pname, user):
#     if(type(user) == str):
#         user_id = User.query.filter_by(username = user).first().id
#         db.session.add(Markup(user_id=user_id, filename = pname))
#     else:
#         db.session.add(Markup(user_id=user, filename=pname))
#     if not project_exist(pname):
#         db.session.add(Project(pname=pname))
#     db.session.commit()


# def delete_user_project(pname, user):
#     if(type(user) == str):
#         user_id = User.query.filter_by(username=user).first().id
#         Markup.query.filter_by(user_id=user_id, filename=pname).delete()
#     else:
#         Markup.query.filter_by(user_id=user, filename=pname).delete()
#     db.session.commit()
#     return True


# def delete_project(pname):
#     Markup.query.filter_by(filename=pname).delete()
#     Project.query.filter_by(pname=pname).delete()
#     db.session.commit()
#     return True


# def create_project(pname):
#     db.session.add(Project(pname=pname))
#     db.session.commit()
#     return True


# def get_all_projects():
#     data = dict()
#     for a in Project.query.all():
#         data[a.pname] = [User.query.filter_by(id=x.user_id).first().username for x in Markup.query.filter_by(filename=a.pname)]
#     return data


# def add_user_for_proect(stringJS):
#     data = json.loads(stringJS)
#     if not user_exist(data['username']):
#         return False
#     if markup_exist(data['username'], data['pname']):
#         return False
#     newUser = User.query.filter_by(username=data['username']).first()
#     m = Markup(user_id=newUser.id, filename=data['pname'])
#     db.session.add(m)
#     db.session.commit()
#     return True
