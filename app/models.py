from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    rights = db.Column(db.String(64), default="user")
    refresh_token = db.Column(db.String(128))
    token = db.Column(db.String(128))
    # email = db.Column(db.String(120), index=True, unique=True)
    # password_hash = db.Column(db.String(128))
    # Markups = db.relationship('Markup', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<User: {}, Id: {}, Online: {}, Rights: {}, RF_token: {}>'.format(self.username, self.id,
                                                                   self.is_authenticated, self.rights, self.refresh_token)

    # def set_password(self, password):
    #     self.password_hash = generate_password_hash(password)
    #
    # def check_password(self, password):
    #     return check_password_hash(self.password_hash, password)


# class Markup(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     filename = db.Column(db.String, index=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#
#     def __repr__(self):
#         return '<Project: {}, User_Id: {}>'.format(self.filename, self.user_id)
#
#
# class Project(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     pname = db.Column(db.String, unique=True)
#
#     def __repr__(self):
#         return '<Project: {}>'.format(self.pname)