const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
const cors_proxy = require('cors-anywhere');


const app = express();
var whitelist = ["http://localhost:3000", 'https://serpapi.com/search.json'];

var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */




const db = require("./models");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

// simple route
//app.get("/", (req, res) => {
 //   res.setHeader('Content-Type', 'application/json');
  //  res.json({ message: "Welcome to library application." });
//});


require("./routes/book.routes")(app);
require("./routes/category.routes")(app);
require("./routes/member.routes")(app);
require("./routes/publisher.routes")(app);
require("./routes/support.routes")(app);
require("./routes/borrowing.routes")(app);
require("./routes/serpApi.routes")(app);

// set port, listen for requests
const host = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8080;


cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(PORT, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + PORT);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});