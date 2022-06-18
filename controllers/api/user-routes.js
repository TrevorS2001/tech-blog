const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

router.get("/", (req, res)=>{
  User.findAll({
    attributes: ["username", "id", "password", "email"],
    include: [
      {
        model: Post,
        as: "posts",
        attributes: ["title", "id", "body"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["comment_text", "id", "post_id"],
      },
    ],
  }).then((dbUserData)=>{
      res.json(dbUserData);
    }).catch((err)=>{
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res)=>{
  User.findOne({
    where:{
      id: req.params.id,
    },
    attributes: ["username", "id", "password", "email"],
    include: [
      {
        model: Post,
        as: "posts",
        attributes: ["id", "title", "body"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["comment_text", "id", "post_id"],
      },
    ],
  }).then((dbUserData)=>{
      if (!dbUserData) {
        res.status(404).json({ message: "Not found" });
        return;
      }
      res.json(dbUserData);
    }).catch((err)=>{
      res.status(500).json(err);
    });
});

router.post("/", (req, res)=>{
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }).then((dbUserData)=>{
      req.session.save(()=>{
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        res.json(dbUserData);
      });
    }).catch((err)=>{
      res.status(500).json(err);
    });
});

router.post("/login", (req, res)=>{
  User.findOne({
    where:{
      email: req.body.email,
    },
  }).then((dbUserData)=>{
      if (!dbUserData) {
        res.status(400).json({ message: "User not found" });
        return;
      }
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: "Incorrect Password!" });
        return;
      }
    }).catch((err)=>{
      res.status(500).json(err);
    });
});

router.put("/", (req, res)=>{
  res.send(`update user`);
});

router.delete("/:id", (req, res)=>{
  User.destroy({
    where:{
      id:req.params.id,
    },
  }).then((dbUserData)=>{
      if (!dbUserData) {
        res.status(404).json({ message: "Not found" });
        return;
      }
      res.json(dbUserData);
    }).catch((err)=>{
      res.status(500).json(err);
    });
});

router.post("/logout", (req, res)=>{
  if (req.session.loggedIn) {
    req.session.destroy(()=>{
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;