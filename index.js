require("dotenv").config();
const path = require("path");
const express = require("express");
const { config, engine } = require("express-edge");
const edge = require("edge.js");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Post = require("./database/models/Post");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const { ExpressOIDC } = require("@okta/oidc-middleware");

//Declare Controllers
const getWhyController = require("./controllers/whyPage")
const createPostController = require("./controllers/createPost");
const homePageController = require("./controllers/homePage");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const getAdminController = require("./controllers/getAdmin");
const handlePostController = require('./controllers/handlePost');
const editPostController = require('./controllers/editPost');
const submitEditController = require('./controllers/submitEdit');

const app = express();
const port = 3000;


app.use(
  session({
    secret: process.env.RANDOM_SECRET_WORD,
    resave: true,
    saveUninitialized: false
  })
);




const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  appBaseUrl: 'http://localhost:3000',
  scope: "openid profile",
  routes:{
    logoutCallback: {
    }
  }
});

mongoose
  .connect("mongodb://localhost:27017/node-blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => "You are now connected to Mongo!")
  .catch(err => console.error("Something went wrong", err));
app.use(oidc.router);
app.use(cors());
app.use(fileUpload());
app.use(express.static(__dirname + "/public/"));
app.use(engine);
app.set("views", `${__dirname}/views`);

app.use((req, res, next) => {
  const result = req.userContext;
  edge.global('auth', result);
  next()
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/* If I need to count documents 
app.use((req, res, next) => {
  Post.countDocuments({}, function(err, count){
    console.log( "Number of docs: ", count );

});
*/

const storePost = require("./middleware/storePost");
app.use("/posts/store", storePost);
// Database
const connection = mongoose.connection;

// Controllers

app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/why", getWhyController);
app.get("/posts/new", oidc.ensureAuthenticated(), createPostController);
app.post("/posts/store", oidc.ensureAuthenticated(), storePostController);
app.get("/admin", oidc.ensureAuthenticated(), getAdminController);
app.post("/post/handle/", oidc.ensureAuthenticated(), handlePostController);
app.get("/post/handle/edit", oidc.ensureAuthenticated(), editPostController);
app.post("/post/handle/submit/edit", oidc.ensureAuthenticated(), submitEditController);
app.get("/home"), function(req,res){
  res.redirect('/');
};

oidc.on("ready", () => {
  app.listen(port, () => console.log(`My Blog App listening on port ${port}!`));
});
