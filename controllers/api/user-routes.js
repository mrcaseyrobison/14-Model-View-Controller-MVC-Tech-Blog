const router = require("express").Router();
const withAuth = require("../../utils/auth");
const { User, Post, Comment } = require("../../models");

// Get API/users
router.get("/", (req, res) => {
    User.findAll({
        attributes: { exclude: ["password"] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get API/users/id
router.get("/:id", (req, res) => {
    User.findOne({
        attributes: { exclude: ["password"]},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ["id", "title", "post_content", "created_at"]
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "created_at"],
                include: {
                    model: Post,
                    attributes: ["title"]
                }
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: "No user with that ID"});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST API/users
router.post("/", (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        twitter: req.body.twitter,
        github: req.body.github
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.twitter = dbUserData.twitter;
            req.session.github = dbUserData.github;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    });
});

// LOGIN
router.post("/login", (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: "No user with that e-mail address" });
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: "Incorrect Password" });
            return;
        }

        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.twitter = dbUserData.twitter;
            req.session.github = dbUserData.github;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: "You are logged in!" });
        });
    });
});

router.post("/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

// PUT API/users/id
router.put("/:id", withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: "No user with this ID" });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.llg(err);
        res.status(500),json(err);
    });
});

// DELETE API/users/id
router.delete("/:id", withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: "No user with this ID" });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;

