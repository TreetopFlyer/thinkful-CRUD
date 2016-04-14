var express = require("express");
var bodyParser = require("body-parser");



// Item represents a named thing that can be stored
var Item = function(inName, inID)
{
    this.name = inName;
    this.id = inID;
};



// Storage has a group of Items.
var Storage = function()
{
    this.items = [];
    this.id = 0;
};
// a wrapper method for the Item constructor
Storage.prototype.add = function(inName)
{
    var item = new Item(inName, this.id)
    this.items.push(item);
    this.id++;
    
    return item;
};
// Return the index of the item with the id inID
Storage.prototype.getIndexOf = function(inID)
{
    var i;
    for(i=0; i<this.items.length; i++)
    {
        if(this.items[i].id == inID)
        {
            return i;
        }
    }
    return undefined;
};
// Remove an item by its id
Storage.prototype.remove = function(inID)
{
    return this.items.splice(inID, 1);
};
// Replace an item by its id
Storage.prototype.replace = function(inID, inItem)
{
    this.items[inID] = inItem;
    return inItem;
};



// Storage instance
var store = new Storage();
store.add("Beans");
store.add("Apples");
store.add("Onions");



// Validation singleton. contains middleware functions
var Validate = {};
// tacks a "valid" object onto the request object that will contain validated values
Validate.setup = function(inReq, inRes, inNext)
{
    inReq.valid = {};
    inNext();  
};
// verify that a numeric id was supplied
Validate.id = function(inReq, inRes, inNext)
{
    var id;
    
    id = inReq.param("id");
    if(id !== undefined)
    {
        id = parseInt(id);
        if(isNaN(id))
        {
            inRes.json({"error":"id is not an integer"});
            return;
        }
    }
    else
    {
        inRes.json({"error":"no id specified"});
        return;
    } 
    
    inReq.valid.id = id;
    inNext();
}
//verify that the supplied id actually matches up to an object in store.items
Validate.index = function(inReq, inRes, inNext)
{
    var index;
    index = store.getIndexOf(inReq.valid.id);
    if(index === undefined)
    {
        inRes.json({"error":"no record found for "+inReq.valid.id});
        return;
    }
    
    inReq.valid.index = index;
    inNext();
}
// verify that a well formed json object is in the request body
Validate.body = function(inReq, inRes, inNext)
{
    if(inReq.body === undefined)
    {
        inRes.json({"error":"request body is empty"});
    }
    else
    {
        if(inReq.body.name === undefined)
        {
            inRes.json({"error":"request body is malformed"});
        }
    }
    
    inReq.valid.body = inReq.body;
    inNext();
}



// Express setup
var server = express();
server.use(bodyParser.json());
server.use("/items", Validate.setup);
server.get("/items", function(inReq, inRes)
{
    inRes.json(store.items);
});
server.post("/items", Validate.body, function(inReq, inRes)
{
    var item = store.add(inReq.valid.body.name);
    inRes.json(item);
});
server.delete("/items/:id", Validate.id, Validate.index, function(inReq, inRes)
{
    var item = store.remove(inReq.valid.index);
    inRes.json(item);
});
server.put("/items/:id", Validate.id, Validate.body, function(inReq, inRes)
{
    var index, item;
    
    index = store.getIndexOf(inReq.valid.id);
    item = inReq.valid.body;
    
    if(index === undefined)
    {
        store.items.push(item);
    }
    
    item = store.replace(inReq.valid.id, item);
    inRes.json(item);
});
server.listen(process.env.PORT, process.env.IP);