function main(container, url) {
	var request = new XMLHttpRequest();
    request.open('GET', 'get_rights', true);
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        try {
          var data = JSON.parse(request.responseText);
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