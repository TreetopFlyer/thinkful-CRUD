var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);


describe("Shopping List", function()
{
   it("should list items on GET", function(inDoneHandler)
   {
      
      chai.request(app).get("/items").end(function(inError, inResponse){
         
         should.equal(inError, null);
         inResponse.should.have.status(200);
         inResponse.should.be.json;
         
         inResponse.body.should.be.a('array');
         inResponse.body.should.have.length(3);
         inResponse.body[0].should.be.a('object');
         inResponse.body[0].should.have.property('id');
         inResponse.body[0].should.have.property('name');
         inResponse.body[0].id.should.be.a('number');
         inResponse.body[0].name.should.be.a('string');
         
         inResponse.body[0].name.should.equal('Beans');
         inResponse.body[1].name.should.equal('Apples');
         inResponse.body[2].name.should.equal('Onions');
         
         inDoneHandler();
       });
   });
   
   
   it("should add an item on POST", function(inDoneHandler)
   {
      
      chai.request(app).post("/items").send({"name":"Kale"}).end(function(inError, inResponse){
         
         should.equal(inError, null);
         inResponse.should.have.status(201);
         inResponse.should.be.json;
         
         inResponse.body.should.be.a('object');
         inResponse.body.should.have.property('id');
         inResponse.body.should.have.property('name');
         inResponse.body.id.should.be.a('number');
         inResponse.body.name.should.be.a('string');
         
         storage.items.should.be.a("array");
         storage.items.should.have.length(4);
         storage.items[3].should.be.a("object");
         storage.items[3].shoud.have.property("id");
         storage.items[3].id.should.be.a("number");
         
         inDoneHandler();
       });
   });
   
});