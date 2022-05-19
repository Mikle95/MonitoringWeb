function register(url, host, token) {
    this.api = new api(url, host, token);
    this.c = document.getElementById("register_form")
    this.userInfo = null;
    this.get_info();

    // this.c.addEventListener('submit', this.try_register.bind(this))
    this.c.onsubmit = this.try_register.bind(this);
}

register.prototype.try_register = function () {
    var keys = ["user_name", "login", "password", "permissions", "boss_login", "hours", "company_name"];
    var body = {};
    var flag = true;
    for (var i = 0; i < keys.length; ++i){
        body[keys[i]] = this.c[i].value;
        this.c[i].setAttribute('class', "");
        if (body[keys[i]] === ""){
            flag = false;
            this.c[i].setAttribute('class', "error");
        }
    }
    this.api.register(body, function (request) {
        window.location = this.api.web_url;
    }.bind(this))
    return false;
}

register.prototype.get_info = function (){
    this.api.get_user_info(function (request) {
        this.userInfo = JSON.parse(request.response);
        this.fill_data();
    }.bind(this))
}

register.prototype.fill_data = function () {
    var company = document.getElementById("cm");
    company.readOnly = this.userInfo["permissions"] !== "admin";
    document.getElementById("bl").value = this.userInfo["login"];
    company.value = this.userInfo["company_name"];
}

