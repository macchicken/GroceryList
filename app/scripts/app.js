(function() {
    var apiKey = "YOUR API KEY";
    var el = new Everlive(apiKey);

    var groceryDataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/" + apiKey + "/Groceries",
                dataType: "jsonp"
            }
        },
        schema: {
            data: function(response) {
                return response.Result;
            }
        }
    });

    function initialize() {
        var app = new kendo.mobile.Application(document.body, {
            skin: "flat",
            transition: "slide"
        });
        navigator.splashscreen.hide();
    }

    document.addEventListener("deviceready", initialize);
}());