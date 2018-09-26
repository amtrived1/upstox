var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var cors = require('cors');
var app = express();
var port = process.env.PORT || 1337;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

routes(app);

var server = app.listen(port, function () {
    console.log("app running on port.", server.address().port);
});