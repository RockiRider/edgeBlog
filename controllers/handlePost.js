const path = require('path')
const Post = require("../database/models/Post");

module.exports = (req, res) => {
  if (req.body.delete != undefined) {
    var gotId = req.body.delete;
    Post.findByIdAndRemove(gotId, req.body, function(err, data) {
      if (err) {
        //Error Msg Popup here!
      }
    });
    res.redirect("/admin");
  } else {
    var gotId = req.body.edit;
    module.exports.id = gotId;
    res.redirect("/post/handle/edit");
  }
};
