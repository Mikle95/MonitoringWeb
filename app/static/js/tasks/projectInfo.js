function projectInfo(container, project_name, creator_login, description) {
    this.c = container;
    this.pname = project_name;
    this.creator = creator_login;
    this.description = description;
    this.users = [];
    this.get_users();
    this.fill_info();
}

projectInfo.prototype.checkUser = function (login) {
    for (const user of this.users)
        if (user === login)
            return true;
    return false;
}

projectInfo.prototype.get_users = function () {
    API.get_project_users(this.pname, this.creator, function (request) {
        for (let user of JSON.parse(request.response))
            this.users.push(user["login"])
    }.bind(this));
}

projectInfo.prototype.fill_info = function () {
    const inputName = document.createElement('input');
    inputName.setAttribute('type', 'text');
    inputName.value = this.pname;

    const inputCreator = document.createElement('input');
    inputCreator.setAttribute('type', 'text');
    inputCreator.value = this.creator;
    inputCreator.readOnly = userInfo["permissions"] !== "admin";

    const inputDescr = document.createElement('textarea');
    inputDescr.value = this.description ? this.description : "";
    inputDescr.classList.add('width-100');

    let nameHeader = document.createElement('div');
    nameHeader.innerText = "Название проекта";
    let cells = [wrap(nameHeader, 'td')];
    cells[0].appendChild(inputName);

    nameHeader = document.createElement('div');
    nameHeader.innerText = "Логин ответственного";
    cells.push(wrap(nameHeader, 'td'));
    cells[1].appendChild(inputCreator);

    let btn = document.createElement('button');
    btn.innerText = "Сохранить изменения";
    btn.onclick = this.update_project.bind(this, inputName, inputCreator, inputDescr);
    cells.push(wrap(btn, 'td'));


    addRow(this.c, cells);


    nameHeader = document.createElement('div');
    nameHeader.innerText = "Описание";
    let cell = wrap(nameHeader, 'td', {"colspan": 2})
    cell.appendChild(inputDescr);

    btn = document.createElement('button');
    btn.innerText = "Удалить";
    btn.onclick = this.delete_project.bind(this, this.pname, this.creator);

    addRow(this.c, [cell, wrap(btn, 'td')]);

}


projectInfo.prototype.delete_project = function (pname, creator){
    API.delete_project(pname, creator, function () {
        document.getElementById('logo').click();
    }.bind(this));
}


projectInfo.prototype.update_project = function (pname, creator, description) {
    if (is_new){
        let project_update = {
        "project_name" : pname.value,
        "project_description" : description.value
        }
        API.add_project(project_update, function (request) {
            alert(request.response);
            this.pname = pname.value;
            this.creator = creator.value;
            this.description = description.value;
            is_new = false;
        }.bind(this));
        return
    }


    let project_update = {
    "old_project_name" : this.pname,
    "project_name" : pname.value,
    "project_description" : description.value,
    "project_creator_login" : creator.value
    }

    if (userInfo['permissions'] === 'admin')
        project_update["old_project_creator_login"] = this.creator;

    API.update_project(project_update, function (request) {
        this.pname = pname.value;
        this.creator = creator.value;
        this.description = description.value;
        alert(request.response);
    }.bind(this));
}