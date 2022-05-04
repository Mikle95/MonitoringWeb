from app import app, api

import dataBaseController

# if dataBaseController.User.query.count() < 1:
#     dataBaseController.add_user("admin", "admin", "admin")

if __name__ == "__main__":
    print(dataBaseController.User.query.all())
    app.run(host=api.host, port=api.port)