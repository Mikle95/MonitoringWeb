function api(url, host, token){
    this.web_url = url;
    this.api_url = host;
    this.token = token;
    this.is_authorized = true;

    this.path_myWorkers = host + "api/v1/getWorkers";
    this.path_user_activity = host + "api/v1/user/activity";
    this.path_getPhoto = host + "api/v1/user/photo";
    this.path_myInfo = host + "api/v1/info/user";
    this.path_register = host + "api/v1/register/user";
    this.path_geo = host + "api/v1/geolocation/get"
    this.path_delete_user =  host + "api/v1/delete/user";
    this.path_notification = host + "api/v1/firebase/notification";
    this.path_push_photo = host + "api/v1/photo/register";

    this.path_allProjects = host + "api/v1/my/project"
    this.path_update_project = host + "api/v1/update/project";
    this.path_delete_project = host + "api/v1/delete/project";
    this.path_add_project = host + "api/v1/create/project";
    this.path_get_project_users = host + "api/v1/project/workers"
    this.path_add_user_to_project = host + "api/v1/add_user/project"

    this.path_get_project_tasks = host + "api/v1/project/task";
    this.path_task_update = host + "api/v1/update/task";
    this.path_add_task = host + "api/v1/create/task";

}

api.prototype.get_project_users = function (pname, creator, callback) {
    this.sendRequest(this.get_token_params(), this.path_get_project_users, callback,
        {"project_name": pname, "project_creator_login": creator}, true);
}

api.prototype.add_user_to_project = function (body, callback) {
    this.sendRequest(this.get_token_params(), this.path_add_user_to_project, callback,
        body, true);
}


api.prototype.get_user_activity = function (login, callback) {
    this.sendRequest(this.get_token_params(), this.path_user_activity, callback,
        {"login": login}, true);
}


api.prototype.add_task = function (task, callback) {
    this.sendRequest(this.get_token_params(), this.path_add_task, callback,
        task, true);
}

api.prototype.task_update = function (task, callback) {
    this.sendRequest(this.get_token_params(), this.path_task_update, callback,
        task, true);
}

api.prototype.delete_project = function (pname, creator, callback) {
    const params = this.get_token_params();
    params["soft"]=true;
    this.sendRequest(params, this.path_delete_project, callback,
        {"project_name": pname, "project_creator_login": creator}, true);
}

api.prototype.get_project_tasks = function (pname, creator, callback) {
    this.sendRequest(this.get_token_params(), this.path_get_project_tasks, callback,
        {"project_name": pname, "project_creator_login": creator}, true);
}

api.prototype.push_photo = function (login, photo, callback) {
    this.sendRequest(this.get_token_params(), this.path_push_photo, callback,
        {"photo": photo, "login": login}, true);
}

api.prototype.add_project = function (project, callback) {
    this.sendRequest(this.get_token_params(), this.path_add_project, callback, project, true);
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
                if(request.status === 401) {
                    if (this.is_authorized) {
                        this.is_authorized = false;
                        alert(JSON.parse(request.response)["message"]);
                        window.location = this.web_url + "refresh_token";
                    }
                }
                else
                    alert(JSON.parse(request.response)["message"]);
            }
    })
    request.send(JSON.stringify(req_body));
}