(function () {
    var apiKey = "L9AbAMBD6UeRh3kb";
    var el = new Everlive(apiKey);
	var app;

    var groceryDataSource = new kendo.data.DataSource({
        // transport: {
        //     read: {
        //         url: "https://api.everlive.com/v1/" + apiKey + "/Groceries",
        //         dataType: "jsonp"
        //     }
        // },
        // schema: {
        //     data: function (response) {
        //         return response.Result;
        //     }
        // }
        type: "everlive",
        sort: {
            field: "Name",
            dir: "asc"
        },
        transport: {
            typeName: "Groceries"
        },
        schema: {
    		model: { Id: "Id", Name: "Name" }
  		}
    });

    function initialize() {
        // el.Users.login("Barry", "123",
        //     function (data) {
        //         groceryDataSource.read();
        //     }
        // );
        app = new kendo.mobile.Application(document.body, {
            skin: "flat",
            transition: "slide"
        });
        $("#grocery-list").kendoMobileListView({
            dataSource: groceryDataSource,
            template: $("#item-model-view-template").text()
        });
        navigator.splashscreen.hide();
    };
    window.loginView = kendo.observable({
        submit: function () {
            if (!this.username) {
                navigator.notification.alert("Username is required.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Password is required.");
                return;
            }
            el.Users.login(this.username, this.password,
                function (data) {
                    window.location.href = "#list";
                    groceryDataSource.read();
                },
                function () {
                    navigator.notification.alert("Unfortunately we could not find your account.");
                });
        },
        toRegis: function () {
            window.location.href = "#register";
        },
        toForgotP: function () {
            window.location.href = "#password";
        }
    });
    window.registerView = kendo.observable({
        submit: function () {
            if (!this.username) {
                navigator.notification.alert("Username is required.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Password is required.");
                return;
            }
            el.Users.register(this.username, this.password, {
                    Email: this.email
                },
                function () {
                    navigator.notification.alert("Your account was successfully created.");
                    window.location.href = "#login";
                },
                function () {
                    navigator.notification.alert("Unfortunately we were unable to create your account.");
                });
        }
    });
    window.passwordView = kendo.observable({
        submit: function () {
            if (!this.email) {
                navigator.notification.alert("Email address is required.");
                return;
            }
            $.ajax({
                type: "POST",
                url: "https://api.everlive.com/v1/" + apiKey + "/Users/resetpassword",
                contentType: "application/json",
                data: JSON.stringify({
                    Email: this.email
                }),
                success: function () {
                    navigator.notification.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                    window.location.href = "#login";
                },
                error: function () {
                    navigator.notification.alert("Unfortunately, an error occurred resetting your password.")
                }
            });
        }
    });
    window.listView = kendo.observable({
        logout: function (event) {
            // Prevent going to the login page until the login call processes.
            event.preventDefault();
            el.Users.logout(function () {
                this.loginView.set("username", "");
                this.loginView.set("password", "");
                window.location.href = "#login";
            }, function () {
                navigator.notification.alert("Unfortunately an error occurred logging out of your account.");
            });
        }
    });
    window.addView = kendo.observable({
        add: function () {
            if (!this.grocery) {
                navigator.notification.alert("Please provide a grocery.");
                return;
            }
            groceryDataSource.add({
                Name: this.grocery,
                Id: ""
            });
            groceryDataSource.one("sync", this.close);
            groceryDataSource.sync();
        },
        close: function () {
            $("#add").data("kendoMobileModalView").close();
            this.grocery = "";
        }
    });

    window.ItemDetail = {
        show: function () {
            var location = window.location.toString();
			var itemId = location.substring(location.lastIndexOf('?') + 4);
            var oneitem=groceryDataSource.get(itemId);
			kendo.bind($('#itemContent'), oneitem, kendo.mobile.ui);
        },
        modify: function () {
			var oneitem=groceryDataSource.get($('#grid').val());
            oneitem.set("Name",$('#grname').val());
            groceryDataSource.sync();
            app.navigate("#:back");
        },
        delete: function () {
			var oneitem=groceryDataSource.get($('#grid').val());
            groceryDataSource.remove(oneitem);
            groceryDataSource.sync();
            app.navigate("#:back");
        }
    };

    document.addEventListener("deviceready", initialize);
}());