function wrap(element, tag, attributes={}) {
    let wrapper = document.createElement(tag);
    for (const key of Object.keys(attributes))
        wrapper.setAttribute(key, attributes[key]);

    wrapper.appendChild(element);
    return wrapper;
}

function overEvent(event) {
    if (event.type === 'mouseover')
        this.classList.add("over");
    if (event.type === 'mouseout')
        this.classList.remove("over");
}

function popup_close(e) {
    if (e.target !== this)
        return;

    const popup = document.querySelector('.popup');
    const container = document.getElementById("popup_screen");
    container.innerHTML = "";
    popup.setAttribute('class', 'popup');
}

function new_project() {
    const project = {"project_name": "",  "project_description": "", "project_creator_login": mainController.userInfo["login"]}
    post_redirect("taskmanager", project);
}

function post_redirect(url, data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    // form.target = '_blank';
    form.method = 'post';
    form.action = url;
    for (var name in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = data[name];
        form.appendChild(input);
    }
    form.submit();
    document.body.removeChild(form);
}

function get_request_body(path, type, params, body){
    return {"url": path, "params": params,
    "body": body, "type": type}
}

function addRow(container, elements) {
    const row = document.createElement('tr');
    for (const element of elements)
        row.appendChild(element);
    row.classList.add('row')
    container.querySelector('tbody').appendChild(row);
}

function setMouseOver(elements) {
    for (const element of elements)
        element.onmouseout = element.onmouseover = overEvent;
}

function compare_End_time(a, b) {
        return  a["end_time"] > b ["end_time"] ? 1 : -1;
    }

task_template = {
        "creator_login": "",
        "project_name": "",
        "task_name": "new",
        "task_description": "",
        "start_time": "2021-04-15T21:00:00.000+00:00",
        "end_time": "2021-04-15T24:00:00.000+00:00",
        "status": "NEW",
        "progress": "",
        "worker_login": ""
    }