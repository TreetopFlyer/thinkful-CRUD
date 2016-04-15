var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app/server');

var server = app.server;
var storage = app.storage;

var should = chai.should();
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
      chai.request(server).get("/items").end(function(inError, inResponse){
         
         //good response
         checkStatus(inError, inResponse, 200);
         
         //storage has 3 members
         checkArray(inResponse.body, 3);
         
         //storage contians Items
         checkItem(inResponse.body[0]);
         
         // verify existing items in storage
         inResponse.body[0].name.should.equal('Beans');
         inResponse.body[1].name.should.equal('Apples');
         inResponse.body[2].name.should.equal('Onions');
         
         inDoneHandler();
       });
   });
   
   
   it("should add an item on POST", function(inDoneHandler)
   {
      chai.request(server).post("/items").send({"name":"Kale"}).end(function(inError, inResponse){
         
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
      chai.request(server).put("/items/3").send({"name":"Corn", "id":3}).end(function(inError, inResponse){
         
         //good response
         checkStatus(inError, inResponse, 201);
         
         //updated item
         checkItem(inResponse.body);
         
         //storage still has 4 members
         checkArray(storage.items, 4);
         
         //the members are items
         checkItem(storage.items[3]);
         
         // verify that the Item sent now exists in storage under the right id
         storage.items[3].name.should.equal("Corn");
         storage.items[3].id.should.equal(3);
         
         inDoneHandler();
       });
   });
   
   
   it("should remove an item on DELETE", function(inDoneHandler)
   {
      chai.request(server).delete("/items/3").end(function(inError, inResponse){
         
         //good response
         checkStatus(inError, inResponse, 200);
         
         // verify that the right item was deleted
         inResponse.body.id.should.equal(3);
         
         // check that storage is now smaller
         checkArray(storage.items, 3);
         
         inDoneHandler();
       });
   });
   
   
   it("throw an error when PUT with a malformed body", function(inDoneHandler)
   {
      chai.request(server).put({"nme":"bananas"}).end(function(inError, inResponse){
         
         should.exist(inError);
         
         inDoneHandler();
       });
   });
   
   it("throw an error when DELETE with a bad id", function(inDoneHandler)
   {
      chai.request(server).delete("/items/10").end(function(inError, inResponse){

         should.exist(inError);
         
         inDoneHandler();
       });
   });

   
});