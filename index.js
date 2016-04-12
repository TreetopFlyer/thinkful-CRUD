var express = require("express");
var bodyParser = require("body-parser");

var Item = function(inName, inID)
{
    this.name = inName;
    this.id = inID;
};


var Storage = function()
{
    this.items = [];
    this.id = 0;
};
Storage.prototype.add = function(inName)
{
    var item = new Item(inName, this.id)
    this.items.push(item);
    this.id++;
    
    return item;
};
Storage.prototype.get = function(inID)
{
    
};


var store = new Storage();
store.add("Beans");
store.add("Apples");
store.add("Onions");


var server = express();

server.use(bodyParser.json());
server.use("/items", function(inReq, inRes, inNext)
{
    var i, id, match;
    
    id = parseInt(inReq.param("id"));
    for(i=0; i<store.items.length; i++)
    {
        if(id === store.items[i].id)
        {
            match = i;
            break;
        }
    }
    inReq.storage = {
        id: id,
        index: match,
        model: inReq.body
    };
    
    inNext();
});

server.get("/items", function(inReq, inRes)
{
     inRes.json(store.items);
});
server.post("/items", function(inReq, inRes)
{
    var item = store.add(inReq.body.name);
    inRes.json(item);
});
server.delete("/items/:id", function(inReq, inRes)
{
    var i;
    var id = parseInt(inReq.params.id);
    var match = {"error":"no item has the id: "+id};
    for(i=0; i<store.items.length; i++)
    {
        if(id === store.items[i].id)
        {
            match = store.items.splice(i, 1);
            break;
        }
    }
    inRes.json(match);
});
server.put("/items/:id", function(inReq, inRes)
{
    var i;
    var id = parseInt(inReq.params.id);
    var match = {"error":"no item has the id: "+id};
    for(i=0; i<store.items.length; i++)
    {
        if(id === store.items[i].id)
        {
            store.items[i] = inReq.body;
            match = inReq.body;
            break;
        }
    }
    inRes.json(match);
});
server.listen(process.env.PORT, process.env.IP);