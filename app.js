const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route('/articles')

  .get(function (req, res) {
    Article.find()
      .then(function (foundArticles) {
        res.send(foundArticles)
      })
      .catch(function (err) {
        res.send(err);
      })
  })

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save()
      .then(function () {
        res.send("Successfully added a new article");
      })
      .catch(function (err) {
        res.send("Unable to save article to database.")
      })
  })

  .delete(function (req, res) {
    Article.deleteMany()
      .then(function () {
        res.send("Successfully delete all articles.");
      })
      .catch(function (err) {
        res.send("Unable to delete articles from database.")
      })
  })

  app.route("/articles/:articleTitle")
  .get(function(req, res){
    Article.findOne({title: req.params.articleTitle})
    .then(function (foundArticle){
if(foundArticle){
      res.send(foundArticle)
} else{
  res.send("No articles matching that title was found")
}
    })
      .catch(function(err){
        console.log(err);
      })
    })
      .put(function (req, res) {
        Article.replaceOne(
          {title: req.params.articleTitle},
          {title: req.body.title, content: req.body.content},
          {overwrite: true}
        )
        .then(function() {
          res.send("Successfully updated article.");
        })
        .catch(function (err) {
          res.send("err")
        })
      })
    .patch(function(req,res){
      Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
      )
      .then(function() {
        res.send("Successfully updated article.");
      })
      .catch(function (err) {
        res.send("err")
      })
    })
    .delete(function(req, res){
      Article.deleteOne(
        {title: req.params.articleTitle}
      )
      .then(function(){
        res.send("Successfully deleted article")
      })
      .catch(function(err){
        res.send("err")
      })
    })     

   

app.listen(3000, function () {
  console.log("Server started on port 3000");
});