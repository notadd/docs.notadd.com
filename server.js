const express = require("express");
const ip = require("ip");

const app = new express();

app.use(express.static(process.cwd()));

app.listen(4000);

console.log(`Servering on: http://${ip.address()}:4000`);
