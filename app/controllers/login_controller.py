import requests
from app import api


def get_token(user):
    response = refresh(user.refresh_token)
    if response is None:
        return None
    else:
        return response


def refresh_or_login(username, password, rf_token):
    response = refresh(rf_token)
    if response is None or response.status_code != 200:
        return login(username, password)
    return response


def login(username, password):
    data = {"login": username, "password": password}
    try:
        return requests.post(api.login, json=data)
    except:
        return None


def refresh(rf_token):
    params = {"refresh_token": rf_token}
    try:
        return requests.post(api.refresh, params=params)
    except:
        return None


if __name__ == "__main__":
    print(login("tipikambr@yandex.ru", "qwerty"))
