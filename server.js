const express = require("express");

const app = new express();

app.use(express.static(process.cwd()));

app.listen(4000);
