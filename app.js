const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

const PORT = 3004;
//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");   //set view engine template
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, data){
        if(err) {
            console.log(err)
        } else {
            res.redirect("/blogs");
        }
    });
})

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
})

//EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            console.log(foundBlog);
            res.render("edit", {blog: foundBlog});
        }
    })
})

//UPDATE ROUTE

app.put("/blogs/:id", function(req, res){   
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//DELETE ROUTE

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");            
        }
    })
})

//LISTEN TO PORT
app.listen(PORT, function(){
    console.log("Listening on port: " +  PORT );
})