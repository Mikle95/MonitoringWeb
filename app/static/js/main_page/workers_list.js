function workers_list(container, api, data, username=null){
    this.username = username;
    this.api = api;
    this.data = data === null ? {} : data;
    this.c = container;
    this.fill_list();
}

workers_list.prototype.fill_list = function (){
    var body = this.username != null ? {'login': this.username} : null;
    var type = this.username != null;
    this.api.sendRequest(this.api.get_token_params(), this.api.path_myWorkers, function (request){
        this.data["workers"] = JSON.parse(request.response);
        // alert(this.data);
        for (const worker of this.data["workers"]){
            var worker_ui = this.init_worker_UI(worker);
            worker_ui.addEventListener('click', this._popup_user.bind(this, worker));
            worker_ui.onmouseover = worker_ui.onmouseout = overEvent;
            this.c.appendChild(worker_ui);
        }
    }.bind(this), body, type);
}

workers_list.prototype.init_worker_UI = function(worker){
    const container = document.getElementById('user_template').cloneNode(true);
    var line1 = container.querySelector(".top_line");
    line1.innerText = worker["user_name"] + "\t(" + worker["permissions"] + ")";
    var line2 = container.querySelector(".bottom_line");
    line2.innerText = worker["login"] + "\t" + "часы: " + worker["hours"];

    line1 = container.querySelector(".top_line_2");
    line1.innerText = "Последняя геолокация";
    line2 = container.querySelector(".bottom_line_2");
    line2.innerText = worker["last_geolocation"] === null ? "---" : worker["last_geolocation"];

    this._load_photo(worker, container.querySelector("img"));

    var styleClass = 'row ' + (worker["is_active"] ? 'active' : 'inactive');
    container.setAttribute('class', styleClass);

    return container;
}

workers_list.prototype._load_photo = function (worker, img){
    var body = {"login": worker["login"]};
    img.setAttribute('src', "../static/data/no_photo.png");

    this.api.sendRequest(this.api.get_token_params(), this.api.path_getPhoto, function (request) {
        worker['photo'] = null;
        if (request.response === "NO PHOTO")
            return;
        worker['photo'] = request.response;
        img.setAttribute('src', "data:image/jpg;base64," + request.response);
    }.bind(this), body, true);
}

workers_list.prototype._popup_user = function (user){
    const popup = document.querySelector('.popup');
    const container = document.getElementById("popup_screen");

    container.appendChild(this.init_target_user_UI(user));

    popup.classList.add("popup_open");
}

workers_list.prototype.init_target_user_UI = function (worker) {
    const container = this.init_worker_UI(worker);
    this.setPhotoEvent(container, worker);

    this.add_map(container, worker);
    this.add_bottom_table(container, worker);
    // this.sendNotificationLine(container, worker);
    this.add_delete_btn(container, worker);

    return container;
}


workers_list.prototype.add_bottom_table = function (container, worker) {
    const tbody = container.querySelector("tbody")
    let row = document.createElement('tr');
    tbody.appendChild(row);
    row.innerHTML = "<td></td><td class='column'>Активность</td>";
    let td = document.createElement('td');
    row.appendChild(td);
    this.sendNotificationLine(td, worker);

    row = document.createElement('tr');
    row.append(document.createElement("td"));
    tbody.appendChild(row);
    td = document.createElement('td');
    row.appendChild(td);
    this.add_activity_story(td, worker);
}


workers_list.prototype.add_activity_story = function (container, worker) {
    this.api.get_user_activity(worker["login"], function (request) {
        let mas = JSON.parse(request.response).reverse();
        for (const activity of mas){
            const div = document.createElement('div');
            div.innerHTML = '<div>Start time: ' + activity["start_time"] + '</div>';
            div.innerHTML += '<div>End time: ' + activity["end_time"] + '</div>';
            div.classList.add("row");
            div.classList.add("border-black");
            container.appendChild(div);
        }
    }.bind(this));
}


workers_list.prototype.setPhotoEvent = function (container, worker) {
    img = container.querySelector("img");

    img.onmouseover = img.onmouseout = function (event) {
        if (event.type === 'mouseover')
        this.setAttribute('src', "../static/data/load_photo.png");
    if (event.type === 'mouseout')
        this.setAttribute('src', worker['photo'] === null ? "../static/data/no_photo.png" : "data:image/jpg;base64," + worker['photo']);
    }
    
    img.onclick = function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.setAttribute('accept', ".jpg, .jpeg");

        input.onchange = function (e) {
           const file = e.target.files[0];
           const reader = new FileReader();
           reader.onload = function(event) {
               let dataUri = event.target.result;
               dataUri = dataUri.substring(dataUri.indexOf("base64,") + 7);
               this.api.push_photo(worker['login'], dataUri, function (request) {
                   alert(request.response);
                   worker["photo"] = dataUri;
               }.bind(this));
           }.bind(this);

           reader.readAsDataURL(file);
        }.bind(this);

        input.click();
    }.bind(this);
}

workers_list.prototype.sendNotificationLine = function (container, worker) {
    // let row = document.createElement("tr");
    // let td = document.createElement("td");
    // td.setAttribute("colspan", 3);
    let text = document.createElement('input');
    text.setAttribute('type', "text")
    let btn = document.createElement('button');
    btn.innerText = "Отправить уведомление";
    btn.addEventListener('click', function () {
        this.api.send_notification(worker["login"], text.value);
    }.bind(this));

    // td.append(text, btn);
    // row.appendChild(td);
    container.appendChild(text);
    container.appendChild(btn);
}

workers_list.prototype.add_delete_btn = function (container, worker){
    let line1 = container.querySelector(".top_line_2");
    let btn = document.createElement('button');
    btn.innerText = "Удалить";
    btn.classList.add("menu");
    btn.addEventListener('click', function () {
        this.api.delete_user(worker["login"]);
    }.bind(this));
    line1.appendChild(btn);
}

workers_list.prototype.add_map = function(container, worker) {
    let row = document.createElement("tr");
    let td = document.createElement("td");

    row.appendChild(td);
    td = td.cloneNode(true);
    td.setAttribute("colspan", 2);
    let mapDiv = document.createElement('div');
    mapDiv.setAttribute('id', "map");
    mapDiv.setAttribute('class', 'map close');


    td.appendChild(mapDiv);
    row.appendChild(td);
    container.querySelector("tbody").appendChild(row);
    container.classList.add('width-98');

    let line1 = container.querySelector(".top_line_2");
    line1.innerText = "";
    let btn = document.createElement('button');
    btn.innerText = "Последняя геолокация"
    btn.addEventListener('click', function () {
        if (mapDiv.classList.length === 1)
            mapDiv.setAttribute('class',  "map close");
        else
            this.api.sendRequest(this.api.get_token_params(), this.api.path_geo, function (request) {
                if (request.response === "[]") {
                    alert("Нет геопозиции!");
                    return;
                }
                mapDiv.innerHTML = "";
                mapDiv.setAttribute("class", "map");
                const geo = JSON.parse(request.response)[0];
                initMap([geo["latitude"], geo["longitude"]]);
            }.bind(this), {"login": worker["login"]}, true);
    }.bind(this));
    line1.appendChild(btn);
}

function initMap(geo){
    let map = new ymaps.Map('map', {
		center: geo,
		zoom: 17,
        controls: [],
        behaviors: ["drag", "scrollZoom"]
	});

    let marker = new ymaps.Placemark(geo, {});
    map.geoObjects.add(marker);
}