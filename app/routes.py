from app import app, lc, api
from app.models import User
from flask import jsonify, request, render_template, redirect, url_for, flash
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
import dataBaseController


@app.route('/login/', methods=["POST", "GET"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == "POST":
        name = request.form["nm"]
        password = request.form["pw"]
        user = User.query.filter_by(username=name).first()
        if user is None:
            response = lc.login(name, password)
            if response is None or response.status_code != 200:
                flash('No connection to server' if response is None else response.json()["message"])
                return redirect(url_for('login'))
            user = dataBaseController.add_user(name, response.json()["refresh_token"], response.json()["token"])
        else:
            print("TODO update token")
            # TODO update token
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
        dataBaseController.delete_user(current_user.username)
        logout_user()
    return redirect(url_for('index'))


@app.route('/<text>')
def echo(text):
    return render_template("index.html", content=text)


@app.route('/main_page')
@login_required
def main_page():
    # TODO - проверка на время токена
    return render_template("monitoring_main.html", api_url=api.api_host, token=current_user.token, url=api.url)


@app.route('/refresh_token')
@login_required
def refresh_token():
    return lc.refresh(current_user.refresh_token)


# @app.route('/get_all_users/', methods=["GET", "POST"])
# @login_required
# def get_all_users():
#     if current_user.rights != 'admin':
#         return "Permission denied"
#     data = dataBaseController.get_all_users()
#     return jsonify(data)


@app.route('/test_post/', methods=["POST"])
@login_required
def test_post():
    return request.data


@app.route('/')
@app.route('/check')
def index():
    return redirect(url_for('main_page'))


@app.route('/shutdown', methods=['GET'])
@login_required
def shutdown():
    if current_user.rights != "admin":
        return "Permission denied"
    shutdown_server()
    return 'Server shutting down...'


def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

