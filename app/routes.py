from app import app
from app.models import User
from flask import jsonify, request, render_template, redirect, url_for, flash
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
import dataBaseController
import json


@app.route('/')
@app.route('/check')
def index():
    return redirect(url_for('main_page'))


def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


@app.route('/shutdown', methods=['GET'])
@login_required
def shutdown():
    if current_user.rights != "admin":
        return "Permission denied"
    shutdown_server()
    return 'Server shutting down...'


@app.route('/login/', methods=["POST", "GET"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == "POST":
        name = request.form["nm"]
        password = request.form["pw"]
        user = User.query.filter_by(username=name).first()
        if user is None or not user.check_password(password):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('main_page')
        return redirect(next_page)
    else:
        return render_template("login.html")


@app.route('/logout/')
def logout():
    if current_user.is_authenticated:
        logout_user()
    return redirect(url_for('index'))


@app.route('/<text>')
def echo(text):
    return render_template("index.html", content=text)


@app.route('/main_page')
@login_required
def main_page():
    return render_template("monitoring_main.html")


@app.route('/get_all_users/', methods=["GET", "POST"])
@login_required
def get_all_users():
    if current_user.rights != 'admin':
        return "Permission denied"
    data = dataBaseController.get_all_users()
    return jsonify(data)


@app.route('/add_user/', methods=["GET", "POST"])
@login_required
def add_user():
    data = json.loads(request.data)
    return "Not available"


@app.route('/delete_user/', methods=["GET", "POST"])
@login_required
def delete_user():
    data = json.loads(request.data)
    return "Not available"


@app.route('/get_rights/', methods=["GET"])
def get_rights():
    return jsonify([current_user.username, current_user.rights])


@app.route('/test_post/', methods=["POST"])
@login_required
def test_post():
    return request.data


