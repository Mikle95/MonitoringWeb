from app import app

import dataBaseController

if dataBaseController.User.query.count() < 1:
    dataBaseController.add_user("admin", "admin", "admin")

if __name__ == "__main__":
    app.run()