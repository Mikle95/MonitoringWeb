function main(url, host, token) {
    this.api = new api(url, host, token);
    this.userInfo = null;
    this.api.get_user_info(function (request) {
        this.userInfo = JSON.parse(request.response);
    }.bind(this))

    this.d = new dataStore(this.api);
	this.user_list = new workers_list(document.getElementById("user_list"), this.api, this.d.data);
    this.project_list = new project_list(document.getElementById("project_list"), this.api, this.d.data);
    
    document.getElementById("logo").addEventListener('click', this.makeToast.bind(this));
}

main.prototype.makeToast = function () {
    alert("Чего ты этим хотел добиться?");
}

popup_close = function (e) {
    if (e.target !== this)
        return;

    const popup = document.querySelector('.popup');
    const container = document.getElementById("popup_screen");
    container.innerHTML = "";
    popup.setAttribute('class', 'popup');
}