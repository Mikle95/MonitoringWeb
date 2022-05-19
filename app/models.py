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

    def __repr__(self):
        return '<User: {}, Id: {}, Online: {}, Rights: {}, RF_token: {}>'.format(self.username, self.id,
                                                                   self.is_authenticated, self.rights, self.refresh_token)
