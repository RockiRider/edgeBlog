const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const { config, engine } = require('express-edge');
const bodyParser = require('body-parser');
const Post = require('./database/models/Post');
const fileUpload = require("express-fileupload");

const app = express();

mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

app.use(fileUpload());
app.use(express.static(__dirname + '/public/'));
app.use(engine);
app.set('views', `${__dirname}/views`);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

const storePost = require('./middleware/storePost')

app.use('/posts/store', storePost)

// Controllers 

/* 

app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/posts/new", createPostController);
app.post("/posts/store", storePostController);

*/

app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    })
});

app.get('/posts/new', (req, res) => {
    res.render('create')
});

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});

app.post("/posts/store", (req, res) => {
    const {
        image
    } = req.files
 
    image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
        Post.create({
            ...req.body,
            image: `/posts/${image.name}`
        }, (error, post) => {
            res.redirect('/');
        });
    })
});

app.listen(4000, () => {
    console.log('App listening on port 4000')
});