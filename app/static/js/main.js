function main(url, host, token) {
    this.api = new api(url, host, token);
	this.user_list = new workers_list(document.getElementById("user_list"), this.api);
    this.project_list = new project_list(document.getElementById("project_list"), this.api);
    
    document.getElementById("logo").addEventListener('click', this.makeToast.bind(this));
}

main.prototype.makeToast = function () {
    alert("Чего ты этим хотел добиться?");
}