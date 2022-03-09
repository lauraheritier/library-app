module.exports = app => {
    const api = require("../controllers/serpApi.controller.js");
  
    var router = require("express").Router(); 

    router.get(`/:author/:title/:isbn`, api.quote);
    app.use('/api/serpApi', router);
}

