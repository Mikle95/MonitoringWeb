function projectInfo(container, api, project_name, creator_login, description) {
    this.c = container;
    this.api = api;
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
    inputCreator.readOnly = userInfo !== "admin";

    const nameCell = document.createElement('td');

    addRow(this.c, );

    const inputDescr = document.createElement('input');
    inputDescr.setAttribute('type', 'text');
    inputDescr.value = this.description;

}