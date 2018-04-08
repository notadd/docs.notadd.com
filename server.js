const express = require("express");
const ip = require("ip");
const { openInBrowser } = require("@already/open-in-browser");

const app = new express();

app.use(express.static(process.cwd()));

app.listen(4000);

openInBrowser(`http://${ip.address()}:4000`);

console.log(`Servering on: http://${ip.address()}:4000`);
