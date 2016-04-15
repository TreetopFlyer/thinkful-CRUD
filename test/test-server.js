var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);


function checkStatus(inError, inResponse, inStatus)
{
   should.equal(inError, null);
   inResponse.should.have.status(inStatus);
   inResponse.should.be.json;
}
function checkItem(inItem)
{
   inItem.should.be.a('object');
   
   inItem.should.have.property('id');
   inItem.id.should.be.a('number');
   
   inItem.should.have.property('name');
   inItem.name.should.be.a('string');
}
function checkArray(inArray, inLength)
{
   inArray.should.be.a("array");
   inArray.should.have.length(inLength);
}

describe("Shopping List", function()
{
   it("should list items on GET", function(inDoneHandler)
   {
      chai.request(app).get("/items").end(function(inError, inResponse){
         
         //good response
         checkStatus(inError, inResponse, 200);
         
         //storage has 3 members
         checkArray(inResponse.body, 3);
         
         //storage contians Items
         checkItem(inResponse.body[0]);

         inResponse.body[0].name.should.equal('Beans');
         inResponse.body[1].name.should.equal('Apples');
         inResponse.body[2].name.should.equal('Onions');
         
         inDoneHandler();
       });
   });
   
   
   it("should add an item on POST", function(inDoneHandler)
   {
      chai.request(app).post("/items").send({"name":"Kale"}).end(function(inError, inResponse){
         
         //good response
         checkStatus(inError, inResponse, 201);
         
         //Item was added
         checkItem(inResponse.body);
         
         //storage now has 4 members
         checkArray(storage.items, 4);
         
         //the members are items
         checkItem(storage.items[3]);
         
         inDoneHandler();
       });
   });
   
   
   it("should update an item on PUT", function(inDoneHandler)
   {
      
      chai.request(app).put("/items/3").send({"name":"Corn", "id":3}).end(function(inError, inResponse){
         
         checkStatus(inError, inResponse, 201);
         checkItem(inResponse.body);
         checkArray(storage.items, 4);
         checkItem(storage.items[3]);

         storage.items[3].name.should.equal("Corn");
         storage.items[3].id.should.equal(3);
         
         inDoneHandler();
       });
   });
   
   
   it("should remove an item on DELETE", function(inDoneHandler)
   {
      
      chai.request(app).delete("/items/3").end(function(inError, inResponse){
         
         checkStatus(inError, inResponse, 200);
         
         inResponse.body.id.should.equal(3);
         
         storage.items.should.be.a("array");
         storage.items.should.have.length(3);
         
         inDoneHandler();
       });
   });
   
   
   
   
});