import requests

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
        response = lc.login(name, password)
        if response is None or response.status_code != 200:
            flash('No connection to server' if response is None else response.json()["message"])
            return redirect(url_for('login'))

        user = dataBaseController.add_or_update_user(name, response.json()["refresh_token"], response.json()["token"])

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
    flag, ret = refresh()
    if not flag:
        return ret

    return render_template("monitoring_main.html", api_url=api.api_host, token=current_user.token, url=api.url)


def refresh():
    response = lc.refresh(current_user.refresh_token)
    if response is None:
        return False, redirect("No connection to server")
    elif response.status_code != 200:
        logout_user()
        flash(str(response.json()["message"]))
        return False, redirect("login")
    dataBaseController.update_user_token(current_user.username, response.json()["refresh_token"],
                                         response.json()["token"])
    return True, current_user.token


@app.route('/refresh_token')
@login_required
def refresh_token():
    flag, ret = refresh()
    return ret


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


@app.route('/api/', methods=["POST"])
@login_required
def api_request():
    data = request.json
    try:
        if data["type"].lower() == "get":
            return requests.get(data["url"], params=data["params"]).text
        if data["type"].lower() == "post":
            return requests.post(data["url"], json=data["body"], params=data["params"]).text
    except:
        flash("No connection to server")
        return None


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

