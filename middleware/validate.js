// Validation singleton. contains middleware functions
var validate = {};

//Storage dependency
validate.store = undefined;

validate.setup = function(inStorage)
{
    validate.store = inStorage;
    return function(inReq, inRes, inNext)
    {
        inReq.valid = {};
        inNext();  
    };
};

// verify that a numeric id was supplied
validate.id = function(inReq, inRes, inNext)
{
    var id;
    id = inReq.param("id");
    if(id !== undefined)
    {
        id = parseInt(id);
        if(isNaN(id))
        {
            inRes.status(400).json({"error":"id is not an integer"});
            return;
        }
    }
    else
    {
        inRes.status(400).json({"error":"no id specified"});
        return;
    } 
    
    inReq.valid.id = id;
    inNext();
};

//verify that the supplied id actually matches up to an object in store.items
validate.index = function(inReq, inRes, inNext)
{
    var index;
    index = validate.store.getIndexOf(inReq.valid.id);
    if(index === undefined)
    {
        inRes.status(400).json({"error":"no record found for "+inReq.valid.id});
        return;
    }
    inReq.valid.index = index;
    inNext();
};

// verify that a well formed json object is in the request body
validate.body = function(inReq, inRes, inNext)
{
    if(inReq.body === undefined)
    {
        inRes.status(400).json({"error":"request body is empty"});
    }
    else
    {
        if(inReq.body.name === undefined)
        {
            inRes.status(400).json({"error":"request body is malformed"});
        }
    }
    
    inReq.valid.body = inReq.body;
    inNext();
};

module.exports = validate;