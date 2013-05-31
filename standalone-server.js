var express = require("express");
var app = express();
var port = 1337;

app.use(express.static("src/core"))

app.listen(port);
console.log("[Cryptocat] listening on port: " + port);
