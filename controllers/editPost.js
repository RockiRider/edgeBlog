//const path = require("path");
const Post = require("../database/models/Post");
const handlePostController = require('../controllers/handlePost');

module.exports = (req, res) => {
  let realId = handlePostController.id;
  Post.findById(realId, function(err, post) {
    if (!err) {
      res.render("edit", {
        post
      });
    } else {
      res.redirect("/admin");
    }
  });
};
