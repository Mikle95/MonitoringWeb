function project_list(container, api, data=null, username=null){
    this.username = username;
    this.api = api;
    this.data = data === null ? {} : data;
    this.c = container;
    this.fill_list();
}

project_list.prototype.fill_list = function (){
    var body = this.username != null ? {'login': this.username} : null;
    var type = this.username != null;
    this.api.sendRequest(this.api.get_token_params(), this.api.path_allProjects, function (request){
        this.data["projects"] = JSON.parse(request.response);
        for (const project of this.data["projects"]){
            this.init_project_UI(project);
        }
    }.bind(this), body, type);
}

project_list.prototype.init_project_UI = function(project){
    
    var container = document.createElement('div');
    var line1 = document.createElement('div');
    line1.innerText = project["project_name"] + "\t\t creator: " + project["project_creator_login"];
    var line2 = document.createElement('div');
    line2.innerText = project["project_description"];

    container.appendChild(line1);
    container.appendChild(line2);

    var styleClass = 'row inactive';
    container.setAttribute('class', styleClass);

    this.c.appendChild(container);

}