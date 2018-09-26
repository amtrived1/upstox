var Upstox = require("upstox");
var ApiKey = "JVt25v44tj92qVGyh8GhG9K6jTYoqn3f5z0JhglH";
var ApiSecret = "vrzjb283rb";
var RedirectUrl = "http://localhost:8080";
var Code = "255ba1a189dfe1b18cd4b3037e6063642949be0c";
var AccessToken = "cc2cedb83382aabdb2746586d19f445b28f86550";
var upstox = new Upstox(ApiKey);

var appRouter = function (app) {
    app.get("/", function (req, res) {
        res.status(200).send({
            message: 'Welcome to our restful API'
        });
    });

    app.post("/setCode", (req, res) => {
        var code = req.param('code');
        if (code) {
            if (code.trim() !== "") {
                Code = code;
                AccessToken = "";
            } else {
                res.status(400).send("Please provide code");
            }
        } else {
            res.status(400).send("Please provide code");
        }
    });

    app.get("/token", (req, res) => {
        if (AccessToken === "") {
            var params = {
                "apiSecret": ApiSecret,
                "code": Code,
                "grant_type": "authorization_code",
                "redirect_uri": RedirectUrl
            };
            upstox.getAccessToken(params)
                .then(function (response) {
                    var accessToken = response.access_token;
                    upstox.setToken(accessToken);
                    console.log(accessToken);
                    res.status(200).send(accessToken);
                })
                .catch(function (err) {
                    console.log(err);
                });
        } else {
            res.status(200).send(AccessToken);
        }
    });

    app.get("/ohlc", (req, res) => {
        console.log(req.query);
        var queryString = req.query;
        if (queryString.exchange && queryString.symbol && queryString.interval && queryString.start_date) {
            var error = false;
            if (queryString.exchange.trim() == "") {
                error = true;
                res.status(400).send("Please provide exchange");
            } else if (queryString.symbol.trim() == "") {
                error = true;
                res.status(400).send("Please provide symbol");
            } else if (queryString.interval.trim() == "") {
                error = true;
                res.status(400).send("Please provide interval");
            } else if (queryString.start_date.trim() == "") {
                error = true;
                res.status(400).send("Please provide start_date");
            }
            if (!error) {
                if (AccessToken !== "") {
                    upstox.isAuthenticated = true;
                    upstox.setToken(AccessToken);
                    upstox.getOHLC({
                            exchange: queryString.exchange,
                            symbol: queryString.symbol,
                            interval: queryString.interval,
                            start_date: queryString.start_date
                        })
                        .then(function (response) {
                            res.status(200).send(response)
                        })
                        .catch(function (error) {
                            console.log("Error", error);
                            res.status(400).send(error);
                        });
                }
            }
        } else {
            res.status(400).send("Please provide parameters")
        }
    });
}

module.exports = appRouter;