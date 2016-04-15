var app = require("./app/server");

app.server.listen(process.env.PORT || 8080, process.env.IP || "localhost");