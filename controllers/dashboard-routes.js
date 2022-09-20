const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../modals");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
    Post.findAll({
        where: {
            // uses the session ID
            user_id: req.session.user_id
        },
        attributes: [
            "id",
            "title",
            "created_at",
            "post_content"
        ],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username", "twitter", "github"]
                }
            },
            {
                model: User,
                attributes: ["username", "twitter", "github"]
            }
        ]
    })
    .then(dbPostData => {
        // Serialize the data
        const posts = dbPostData.map(post => post.get({ plain: true}));
        res.render("dashboard", { posts, loggedIn: true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/edit/:id", withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            "id",
            "title",
            "created_at",
            "post_content"
        ],
        include: [
            {
                model: Comment,
                attributes: ["id", "common_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username", "twitter", "github"]
                }
            },
            {
                model: User,
                attributes: ["username", "twitter", "github"]
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post with this ID"});
            return;
        }

        // Serialize the data
        const post = dbPostData.get({ plain: true});

        res.render("edit-post", {
            post,
            loggedIn: true
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});