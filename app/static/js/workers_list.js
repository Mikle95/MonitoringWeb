function workers_list(container, api, username=null){
    this.username = username;
    this.api = api;
    this.data = null;
    this.c = container;
    this.fill_list();
}

workers_list.prototype.fill_list = function (){
    var body = this.username != null ? {'login': this.username} : null;
    var type = this.username != null ? "POST" : "GET";
    this.api.sendRequest(this.api.get_token_params(), this.api.path_myWorkers, function (request){
        this.data = JSON.parse(request.response);
        // alert(this.data);
        for (const worker of this.data){
            this.init_worker_UI(worker);
        }
    }.bind(this), body, type);
}

workers_list.prototype.init_worker_UI = function(worker){
    var container = document.createElement('div');
    var line1 = document.createElement('div');
    line1.innerText = worker["user_name"] + "\t" + worker["permissions"];
    var line2 = document.createElement('div');
    line2.innerText = worker["login"] + "\t" + "часы: " + worker["hours"];

    container.appendChild(line1);
    container.appendChild(line2);

    var styleClass = 'row ' + (worker["is_active"] ? 'active' : 'inactive');
    container.setAttribute('class', styleClass);

    container.addEventListener('click', this.popup_user.bind(this, worker));

    this.c.appendChild(container);
}

workers_list.prototype.popup_user = function (user){
    const popup = document.querySelector('.popup');
    const container = document.getElementById("popup_screen");
    container.innerText = JSON.stringify(user) ///TODO;
    popup.classList.add("popup_open");
}