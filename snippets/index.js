var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/snippets', function(inError, inDatabase) {
    
    if (inError) {
        console.error(inError);
        inDatabase.close();
        return;
    }
    else
    {
        console.log("connected ok"); 
    }

    var db = inDatabase;
    var collection = inDatabase.collection('snippets');

    var create = function(inName, inContent) {
        
        var snippet = {
            name:inName,
            content:inContent
        };
        
        collection.insert(snippet, function(inError, inResult)
        {
            if(inError){
                console.error("Could not create snippet", inName);
            }
            else{
               console.log("created snippet", inName); 
            }
            
            db.close();
        });
    };

    var read = function(inName) {
        
        var query = {
            name:{$eq:inName}
        };
        
        collection.findOne(query, function(inError, inMatch){
            if(!inMatch || inError){
                console.error("Could not find", inName);
            }
            else{
                console.log("Read snippet", inName);
            }
            
            db.close();
        });
    };

    var update = function(inName, inContent) {
        var query = {
            name:{$eq:inName}
        };
        
        var update = {
            $set:{content:inContent}
        };
        
        collection.findAndModify(query, null, update, function(inError, inResult){
            var snippet = inResult.value;
            if(!snippet || inError){
                console.error("Could not update", inName);
            }
            else{
                console.log("Updated snippet", inName);
            }
            db.close();
        });
    };

    var del = function(inName, inContent) {
        var query = {
            name:inName
        };
        
        collection.findAndRemove(query, function(inError, inResult){
            var snippet = inResult.value;
            
            if(!snippet || inError){
                console.error("could not delete", inName);
            }
            else{
                console.log("snippet deleted", inName);
            }
            db.close();
        });
    };
    
    var list = function()
    {
        collection.find().toArray(function(inError, inItems){
            if(inError){
                console.error("error generating list", inError);
            }
            else{
                console.log(inItems);
            }
            db.close();
        });
    };
    
    var commandError = function()
    {
        console.error('Command not recognized');
        db.close();   
    };

    var main = function() {
        
        switch(process.argv[2]){
            case 'create' :
                create(process.argv[3], process.argv[4]);
                break;
                
            case 'read' :
                read(process.argv[3]);
                break;
                
            case 'update':
                update(process.argv[3], process.argv[4]);
                break;
                
            case 'delete':
                del(process.argv[3]);
                break;
                
            case 'list':
                list();
                break;
                
            default:
                commandError();
        }
    }

    main();
});