var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost');

mongoose.connection.on('error', function(inError){
    console.error('Could not connect:'. inError);
});

mongoose.connection.once('open', function()
{
    var snippetSchema = mongoose.Schema({
        name:{type:String, unique:true},
        content:{type:String}
    });
    var Snippet = mongoose.model('Snippet', snippetSchema);
    
    
    var create = function(inName, inContent)
    {
        Snippet.create({name:inName, content:inContent}, function(inError, inSnippet)
        {
            if(inError || !inSnippet){
                console.error("Could not create snippet", inName);
            }
            else{
                console.log("Snippet created", inName);
            }
            mongoose.disconnect();
        });
    };
    
    var read = function(inName)
    {
        Snippet.findOne({name:inName}, function(inError, inSnippet)
        {
            if(inError || !inSnippet){
                console.error("Could not find snippet", inName);
            }
            else{
                console.log("Snippet", inSnippet);
            }
            mongoose.disconnect();
        });
    };
    
    var update = function(inName, inContent)
    {
        Snippet.findOneAndUpdate({name:inName}, {content:inContent}, function(inError, inSnippet){
            if(inError || !inSnippet){
                console.error("Could not update snippet", inName);
            }
            else{
                console.log("Updated snippet", inName);
            }
            mongoose.disconnect();
        });
    };
    
    var del = function(inName){
        Snippet.findOneAndRemove({name:inName}, function(inError, inSnippet){
            if(inError || !inSnippet){
                console.error("Could not delete", inName);
            }
            else{
                console.log("Deleted", inName);
            }
            mongoose.disconnect();
        });
    };
    
    var list = function()
    {
        Snippet.find({}, function(inError, inList)
        {
            if(inError || !inList){
                console.error("problem generating list");
            }
            else{
                console.log(inList);
            }
            mongoose.disconnect();
        })  
    };
    
    var commandError = function(){
        console.error("Command not recognized");
        mongoose.disconnect();
    };
    
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
    
});