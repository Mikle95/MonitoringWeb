function taskmanager(container, project) {
    this.selector = document.querySelector('select');
    this.c = container;
    this.project = project;
    this.data = null;
    this.refresh();

}

taskmanager.prototype.refresh = function () {
    API.get_project_tasks(this.project.pname, this.project.creator, function (request) {
        this.data = JSON.parse(request.response);
        this.fill_list();
    }.bind(this));
}

taskmanager.prototype.fill_list = function () {
    for (const task of this.data)
        addRow(this.c, [wrap(this.init_task_UI(task), 'td')]);
}

taskmanager.prototype.init_task_UI = function (task) {
    const container = wrap(document.createElement('tbody'), 'table');
    container.setAttribute('class', 'table border-black');
    let cells = [];

    let text = document.createElement('td');
    text.innerText = task["start_time"];
    text.onclick = this.input_time_update.bind(this, "start_time");
    cells.push(text);

    text = document.createElement('td');
    text.innerText = task["task_name"];
    text.onclick = this.input_text_update.bind(this, "task_name", task)
    cells.push(text);

    text = document.querySelector('select').cloneNode(true);
    text.querySelector('.all').remove();
    text.querySelector("." + task["status"].toLowerCase()).setAttribute("selected", "selected");
    text.onchange = function () {

    }.bind(this);
    cells.push(wrap(text, 'td'));

    addRow(container, cells);


    cells = [];
    text = document.createElement('td');
    text.innerText = "---";
    cells.push(text);
    addRow(container, cells);

    cells = [];
    text = document.createElement('td');
    text.innerText = task["end_time"];
    text.onclick = this.input_time_update.bind(this, "end_time")
    cells.push(text);

    addRow(container, cells);


    return container;
}

taskmanager.prototype.input_text_update = function (param_name, task) {
    let out = prompt("Введите " + param_name, task[param_name]);
}

taskmanager.prototype.input_time_update = function (param_name) {

}