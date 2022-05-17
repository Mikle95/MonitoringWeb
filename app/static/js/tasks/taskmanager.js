function taskmanager(container, project) {
    this.selector = document.querySelector('select');
    this.selector.onchange = this.fill_list.bind(this);

    document.getElementById('add_task').onclick = function () {
        const new_task = structuredClone(task_template);
        new_task["creator_login"] = new_task["worker_login"] = userInfo["login"];
        new_task["project_name"] = project.pname;
        new_task["task_name"] += new Date();
        API.add_task(new_task, function (response) {
            this.refresh();
        }.bind(this));
    }.bind(this);

    this.c = container;
    this.project = project;
    this.data = null;
    if (!is_new)
        this.refresh();

}

taskmanager.prototype.refresh = function () {
    API.get_project_tasks(this.project.pname, this.project.creator, function (request) {
        this.data = JSON.parse(request.response);
        this.fill_list();
    }.bind(this));
}

taskmanager.prototype.fill_list = function () {
    this.c.querySelector("tbody").innerHTML = "";
    for (const task of this.data.reverse())
        if (this.selector.value.toLowerCase() === "..." ||
            task["status"].toLowerCase() === this.selector.value.toLowerCase())
            addRow(this.c, [wrap(this.init_task_UI(task), 'td')]);
}

taskmanager.prototype.init_task_UI = function (task) {
    const container = wrap(document.createElement('tbody'), 'table');
    container.setAttribute('class', 'table border-black');

    //Row 1
    let cells = [];
    let text = document.createElement('input');//document.createElement('td');
    text.setAttribute('type', 'datetime-local');
    text.value = task["start_time"].slice(0,16);
    text.onchange = this.input_time_update.bind(this, "start_time", task, text);
    cells.push(wrap(text, 'td'));


    cells.push(this.text_cell("Название:", "task_name", task));
    cells.push(this.text_cell("Ответственный:", "worker_login", task));
    cells.push(this.text_cell("Прогресс:", "progress", task));

    text = this.selector.cloneNode(true);
    text.querySelector('.all').remove();
    if (task["status"] !== null)
        text.querySelector("." + task["status"].toLowerCase()).setAttribute("selected", "selected");
    const status = text;
    text.onchange = function (event) {
        this.update_task_value('status', task, status.value);
    }.bind(this);
    cells.push(wrap(text, 'td'));

    addRow(container, cells);
    setMouseOver(cells);

    // Row 2
    cells = [];
    text = document.createElement('td');
    text.innerText = "---";
    cells.push(text);

    let desc = this.text_cell('описание:', "task_description", task);
    desc.setAttribute('rowspan', '2');
    desc.setAttribute('colspan', '3');
    cells.push(desc);

    text = document.createElement('button');
    text.innerText = "Удалить";
    text.onchange = function () {
        // TODO delete
    }.bind(this);
    cells.push(wrap(text, 'td', {"rowspan":2}));

    addRow(container, cells);
    setMouseOver(cells);

    // Row 3
    cells = [];
    text = document.createElement('input');//document.createElement('td');
    text.setAttribute('type', 'datetime-local');
    text.value = task["end_time"].slice(0,16);
    text.onchange = this.input_time_update.bind(this, "end_time", task, text);
    cells.push(wrap(text, 'td'));

    addRow(container, cells);
    setMouseOver(cells);


    return container;
}

taskmanager.prototype.text_cell = function (header, param, task) {
    let text = document.createElement('td');
    let inner = document.createElement('div');
    inner.innerText = header;
    text.appendChild(inner);
    inner = document.createElement('div');
    inner.innerText = task[param] !== null ? task[param] : "---";
    text.appendChild(inner);
    text.onclick = this.input_text_update.bind(this, param, task);
    return text;
}

taskmanager.prototype.input_text_update = function (param_name, task) {
    let out = prompt("Введите " + param_name, task[param_name]);
    if (out !== null)
        this.update_task_value(param_name, task, out);
}

taskmanager.prototype.input_time_update = function (param_name, task, input) {
    let value = input.value + ":00.000+00:00";
    this.update_task_value(param_name, task, value);
}

taskmanager.prototype.update_task_value = function (param_name, task, value) {
    let new_task = structuredClone(task);
    new_task[param_name] = value;
    API.task_update(new_task, function (request) {
        task[param_name] = value;
        this.fill_list();
    }.bind(this));
}