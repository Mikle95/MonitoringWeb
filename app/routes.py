import requests

from app import app, lc, api
from app.models import User
from flask import jsonify, request, render_template, redirect, url_for, flash, Response
import json
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
import dataBaseController


@app.route('/taskmanager/', methods=["POST"])
@login_required
def taskmanager():
    flag, ret = refresh()
    if not flag:
        return ret
    return render_template("taskmanager.html", api_url=api.api_host, token=current_user.token, url=api.url,
                           name=request.form["project_name"], creator=request.form["project_creator_login"],
                           description=request.form["project_description"],
                           is_new=str(request.form["project_name"] == "").lower())


@app.route('/register/', methods=["GET"])
@login_required
def register():
    return render_template("register.html", api_url=api.api_host, token=current_user.token, url=api.url)


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
    next_page = request.args.get('next')
    if not flag:
        next_page = ret
    if not next_page or url_parse(next_page).netloc != '':
        next_page = redirect(url_for('main_page'))
    return next_page


@app.route('/test_post/', methods=["POST"])
@login_required
def test_post():
    return request.data


@app.route('/api/', methods=["POST"])
@login_required
def api_request():
    data = request.json
    try:
        out = None
        if data["type"].lower() == "get":
            out = requests.get(data["url"], params=data["params"])
        elif data["type"].lower() == "post":
            out = requests.post(data["url"], json=data["body"], params=data["params"])
        return Response(out.text, out.status_code)
    except:
        return Response("No connection", 204)


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

