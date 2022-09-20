const router = require("express").Router();
const withAuth = require ("../../utils/auth");
const { Comment } = require("../../models");

router.get("/", (req, res) => {
    Comment.findAll({})
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

