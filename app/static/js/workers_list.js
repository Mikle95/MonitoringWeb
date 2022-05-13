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
            this.c.appendChild(worker_ui);
        }
    }.bind(this), body, type);
}

workers_list.prototype.init_worker_UI = function(worker){
    const container = document.getElementById('user_template').cloneNode(true);
    var line1 = container.querySelector(".top_line");
    line1.innerText = worker["user_name"] + "\t" + worker["permissions"];
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
        if (request.response === "NO PHOTO")
            return;
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
    this.add_map(container, worker);


    return container;
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
    container.classList.add('current_user');

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