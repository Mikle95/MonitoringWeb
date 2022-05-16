function projectInfo(container, project_name, creator_login, description) {
    this.c = container;
    this.pname = project_name;
    this.creator = creator_login;
    this.description = description;
    this.fill_info();
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

    const btn = document.createElement('button');
    btn.innerText = "Сохранить изменения";
    btn.onclick = this.update_project.bind(this, inputName, inputCreator, inputDescr);
    cells.push(wrap(btn, 'td', {"rowspan":2}));


    addRow(this.c, cells);


    nameHeader = document.createElement('div');
    nameHeader.innerText = "Описание";
    let cell = wrap(nameHeader, 'td', {"colspan": 2})
    cell.appendChild(inputDescr);
    addRow(this.c, [cell]);

}

projectInfo.prototype.update_project = function (pname, creator, description) {
    let project_update = {
    "old_project_name" : this.pname,
    "project_name" : pname.value,
    "project_description" : description.value,
    "project_creator_login" : creator.value
    }

    if (userInfo['permissions'] === 'admin')
        project_update["old_project_creator_login"] = this.creator;

    API.update_project(project_update, function (request) {
        alert(request.response);
    }.bind(this));
}