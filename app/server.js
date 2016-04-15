var express = require("express");

//middleware
var bodyParser = require("body-parser");
var validate = require("../middleware/validate");

//models
var Item = require("../models/item");
var Storage = require("../models/storage");


// Storage instance
var store = new Storage();
store.add("Beans");
store.add("Apples");
store.add("Onions");

// Express setup
var server = express();
server.use(bodyParser.json());
server.use("/items", validate.setup(store));
server.get("/items", function(inReq, inRes)
{
    inRes.json(store.items);
});
server.post("/items", validate.body, function(inReq, inRes)
{
    var item = store.add(inReq.valid.body.name);
    inRes.status(201).json(item);
});
server.delete("/items/:id", validate.id, validate.index, function(inReq, inRes)
{
    var item = store.remove(inReq.valid.index);
    inRes.json(item);
});
server.put("/items/:id", validate.id, validate.body, function(inReq, inRes)
{
    var index, item;
    
    index = store.getIndexOf(inReq.valid.id);
    item = inReq.valid.body;
    
    if(!index)
    {
        store.items.push(item);
    }
    
    item = store.replace(inReq.valid.id, item);
    inRes.status(201).json(item);
});

exports.server = server;
exports.storage = store;