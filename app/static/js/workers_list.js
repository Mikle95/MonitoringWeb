function workers_list(container, api){
    this.api = api;
    this.data = null;
    this.c = container;
    this.fill_list();
}

workers_list.prototype.fill_list = function (){
    this.api.sendRequest(this.api.get_token_params(), this.api.path_myWorkers, function (request){
        this.data = JSON.parse(request.response);
        // alert(this.data);
        for (const worker of this.data){
            this.init_worker_UI(worker);
        }
    }.bind(this));
}

workers_list.prototype.init_worker_UI = function(worker){
    // var body = {"login": worker["login"]};
    // this.api.sendRequest(this.api.get_token_params(), this.api.path_user_activity, function (request){
    //     JSON.parse(request.response);
    // }.bind(this), body, "POST")
    var container = document.createElement('div');
    container.innerText = JSON.stringify(worker);
    container.setAttribute('class', 'column')
    this.c.appendChild(container);
}