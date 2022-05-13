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
}


api.prototype.sendRequest = function(params, path, callback, body=null, is_post=false) {
    var request = new XMLHttpRequest();
    var req_body = get_request_body(path, is_post ? "POST" : "GET", params, body);
    request.open('POST', this.web_url + "api", true);
    request.setRequestHeader('Content-type', "application/json;charset=UTF-8");
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            callback(request);
            // alert(JSON.parse(request.response)["user_name"]);
        }
        else
            if (request.readyState === 4)
                alert(JSON.parse(request.response)["message"]);
    })
    request.send(JSON.stringify(req_body));
}

api.prototype.get_token_params = function (){
    return {"token": this.token};
}

function get_request_body(path, type, params, body){
    return {"url": path, "params": params,
    "body": body, "type": type}
}

api.prototype.get_user_info = function (callback) {
    this.sendRequest(this.get_token_params(), this.path_myInfo, callback);
}

api.prototype.register = function (body, callback) {
    this.sendRequest(this.get_token_params(), this.path_register, callback, body, true);
}

