const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const PORT = 3004;
//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");   //set view engine template
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {
        type: Date,
        default: Date.now
    }
})



var Blog = mongoose.model("Blog", blogSchema);

//seeds data

// Blog.create({
//     title: "Test Blog",
//     image: "https://pixabay.com/get/57e5d7414857af14f6da8c7dda793f7f1636dfe2564c704c732e73d29e4ec35a_340.jpg",
//     body: "Test Blog"
// })

//RESTFUL ROUTE
app.get("/", function(req, res){
    res.redirect("/blogs");
})


app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err)
        } else {
            res.render("index", {blogs: blogs});
        }
    });
})


app.get("/blogs/new", function(req,res){
    res.render("new");
})

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, data){
        if(err) {
            console.log(err)
        } else {
            res.redirect("/blogs");
        }
    });
})


//LISTEN TO PORT
app.listen(PORT, function(){
    console.log("Listening on port: " +  PORT );
})