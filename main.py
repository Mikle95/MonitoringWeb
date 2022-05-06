from app import app, api

# import dataBaseController
# if dataBaseController.User.query.count() < 1:
#     dataBaseController.add_user("admin", "admin", "admin")
# print(dataBaseController.User.query.all())

if __name__ == "__main__":
    app.run(host=api.host, port=api.port)
