function wrap(element, tag) {
    let wrapper = document.createElement(tag);
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

function post_redirect(url, data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.target = '_blank';
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
    for (const element of elements)
        container.querySelector('.tbody').appendChild(wrap(element, 'tr'));
}