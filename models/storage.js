var Item = require("./item");

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
    return this.items.splice(inID, 1)[0];
};

// Replace an item by its id
Storage.prototype.replace = function(inID, inItem)
{
    this.items[inID] = inItem;
    return inItem;
};

module.exports = Storage;