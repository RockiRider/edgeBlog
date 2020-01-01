const path = require("path");
const Post = require("../database/models/Post");
const handlePostController = require("../controllers/handlePost");

module.exports = (req, res) => {
    let realId = handlePostController.id;
    var updated = req.body;
    if (!req.files || Object.keys(req).files === 0) {
        Post.findByIdAndUpdate(realId, { updated }, { new: true }, function (
            err,
            model
        ) {
            if (!err) {
                res.redirect("/admin");
            } else {
                res.redirect("/");
            }
        });
    } else {
        let file = req.files.image;
        //console.log("Yes Upload");
        file.mv(path.resolve(__dirname, ".", "public/posts", file.name), function (err) {
            Post.findByIdAndUpdate(
                realId,
                { updated, image: `/posts/${file.name}` },
                { new: true },
                function (err, model) {
                    if (!err) {
                        res.redirect("/admin");
                    } else {
                        res.redirect("/");
                    }
                }
            );
            if (err) {
                //Create Popup Here!!!!!
                console.log("Error with upload");
            }
        });
    }
};
