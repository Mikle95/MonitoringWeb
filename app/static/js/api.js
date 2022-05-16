function api(url, host, token){
    this.web_url = url;
    this.api_url = host;
    this.token = token;

    this.path_myWorkers = host + "api/v1/all/user";
    this.path_user_activity = host + "api/v1/user/activity";
    this.path_allProjects = host + "api/v1/all/project"
    this.path_getPhoto = host + "api/v1/user/photo";
    this.path_myInfo = host + "api/v1/info/user";
    this.path_register = host + "api/v1/register/user";
    this.path_geo = host + "api/v1/geolocation/get"
    this.path_delete_user =  host + "api/v1/delete/user";
    this.path_notification = host + "api/v1/firebase/notification";
    this.path_update_project = host + "api/v1/update/project";
    this.path_push_photo = host + "api/v1/photo/register";
    this.path_get_project_tasks = host + "api/v1/project/task";
}

api.prototype.get_project_tasks = function (pname, creator, callback) {
    this.sendRequest(this.get_token_params(), this.path_get_project_tasks, callback,
        {"project_name": pname, "project_creator_login": creator}, true);
}

api.prototype.push_photo = function (login, photo, callback) {
    this.sendRequest(this.get_token_params(), this.path_push_photo, callback,
        {"photo": photo, "login": login}, true);
}

api.prototype.update_project = function (project, callback) {
    this.sendRequest(this.get_token_params(), this.path_update_project, callback, project, true);
}

api.prototype.get_token_params = function (){
    return {"token": this.token};
}

api.prototype.get_user_info = function (callback) {
    this.sendRequest(this.get_token_params(), this.path_myInfo, callback, null, false);
}

api.prototype.register = function (body, callback) {
    this.sendRequest(this.get_token_params(), this.path_register, callback, body, true);
}

api.prototype.delete_user = function (login) {
    if (!confirm("Удалить пользователя " + login + "?"))
        return

    let body = {"login": login};
    this.sendRequest(this.get_token_params(), this.path_delete_user, function (request) {
        window.location.reload();
    }.bind(this), body, true);
}

api.prototype.send_notification = function (login, message) {
    let body = {"login": login, "notification": message};
    this.sendRequest(this.get_token_params(), this.path_notification, function (request) {
        alert(request.response);
    }.bind(this), body, true);
}

api.prototype.sendRequest = function(params, path, callback, body=null, is_post=false) {
    var request = new XMLHttpRequest();
    var req_body = get_request_body(path, is_post ? "POST" : "GET", params, body);
    request.open('POST', this.web_url + "api");
    request.setRequestHeader('Content-type', "application/json;charset=UTF-8");
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            callback(request);
            // alert(JSON.parse(request.response)["user_name"]);
        }
        else
            if (request.readyState === 4) {
                alert(JSON.parse(request.response)["message"]);
                if (request.status === 401)
                    window.location = this.web_url + "refresh_token";
            }
    })
    request.send(JSON.stringify(req_body));
}