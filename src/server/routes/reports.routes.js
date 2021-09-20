module.exports = app => {
  const report = require("../controllers/reports.controller.js");

  var router = require("express").Router();
  router.get("/", report.getAllFromReports);
  //3. libraryOnlyQuery
  router.get("/libraryOnly", report.libraryOnlyQuery);

  router.get("/:member/:book", report.borrowingsPerMember);


  app.use('/api/reports', router);
};