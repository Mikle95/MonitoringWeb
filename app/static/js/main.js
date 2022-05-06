function main(url, api, token) {
	this.web_url = url;
    this.api_url = api;
    this.token = token;
	this.user_list = document.getElementById("user_list");
    this.project_list = document.getElementById("project_list");
    
    document.getElementById("logo").addEventListener('click', this.makeToast.bind(this));
}

this.main.prototype.makeToast = function(){
    var request = new XMLHttpRequest();
    request.open('GET', 'get_rights', true);
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        try {
          var data = JSON.parse(request.responseText);
            alert(request.responseText);
          this.username = data[0];
          this.user_rights = data[1];
//          this.cp.add_user();
          if (this.user_rights === 'admin'){
//            this.cp.add_admin_panel_ref();
          }
        }
        catch(err){}
      }
    });
    request.send();
}

this.main.prototype.show_user_list = function(){
    this.user_list.innerHTML = "";
    container = document.createElement('div');

}