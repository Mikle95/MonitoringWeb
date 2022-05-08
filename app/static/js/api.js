function api(url, host, token){
    this.web_url = url;
    this.api_url = host;
    this.token = token;

    this.path_myWorkers = host + "api/v1/getWorkers";
    this.path_user_activity = host + "api/v1/user/activity";
    this.path_allProjects = host + "api/v1/all/project"
}


api.prototype.sendRequest = function(params, path, callback, body=null, type="GET") {
    var request = new XMLHttpRequest();
    var req_body = get_request_body(path, type, params, body);
    request.open('POST', "api", true);
    request.setRequestHeader('Content-type', "application/json;charset=UTF-8");
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            callback(request);
            // alert(JSON.parse(request.response)["user_name"]);
        }
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

