const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

router.get("/", (req, res)=>{
  Comment.findAll({
    attributes: ["comment_text","id","user_id","post_id"],
    include: [
      {
        model:User,
        as:"user",
        attributes:["username"]
      }
    ],
  })
});

//get id
router.get("/:id", (req, res)=>{
  Comment.findOne({
    where:{
      id: req.params.id,
    },
    attributes:["comment_text","id", "user_id", "post_id"],
    include:[
      {
        model: User,
        as: "user",
        attributes: ["username"]
      }
    ],
  })
});


router.post("/", (req, res)=>{
  Comment.create({
    comment_text: req.body.comment_text,
    user_id: req.session.user_id,
    post_id: req.body.post_id
  }).then((dbCommentData)=>{
      res.json(dbCommentData);
    }).catch((err)=>{
      res.status(500).json(err);
    });
});

router.put("/", (req, res)=>{
  res.send(`update comment`);
});

router.delete("/:id", (req, res)=>{
  Post.destroy({
    where:{
      id: req.params.id,
    },
  })
});

module.exports = router;