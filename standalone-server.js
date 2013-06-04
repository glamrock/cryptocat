#!/usr/bin/env node

var path = require("path");
var express = require("express");
var app = express();
var port = 1337;

app.use(express.static(path.join(__dirname, "src/core")));

app.listen(port);
console.log("[Cryptocat] listening on port: " + port);
