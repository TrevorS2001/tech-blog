const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["id", "body", "title", "user_id"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["username"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["id", "comment_text", "user_id"],
      },
    ],
  }).then((dbPostData) => { 
      if (!dbPostData) {
        res.status(404).json({ message: "Not found" });
        return;
      }
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/viewpost/:id",(req, res)=>{
  Post.findOne({
    where:{
      id:req.params.id,
    },
    attributes:["title","id", "user_id", "body"],
    include:[
      {
        model: User,
        as: "user",
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["comment_text","id", "user_id"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username"],
          },
        ],
      },
    ],
  }).then((dbPostData)=>{
      if(!dbPostData) {
        res.status(404).json({ message: "Not found" });
        return;
      }
      const myPost = post.user_id == req.session.user_id;
      res.render("single-post", {
        loggedIn: req.session.loggedIn,
      });
    }).catch((err)=>{
      res.status(500).json(err);
    });
});

module.exports = router;