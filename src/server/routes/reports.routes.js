module.exports = app => {
    const report = require("../controllers/reports.controller.js");
  
    var router = require("express").Router();
  
    //3. libraryOnlyQuery
    router.get("/libraryOnly", report.libraryOnlyQuery);
  
    app.use('/api/reports', router);
  };