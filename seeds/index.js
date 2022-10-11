// const seedPosts = require("./post-seeds");
// const sequelize = require("../config/connection");

// const seedAll = async () => {
//     await sequelize.sync({ force: true});
//     console.log("DATABASE SYNCED");
//     await seedPosts();
//     console.log("POSTS SEEDED");

//     process.exit(0);
// };

// seedAll();

const sequelize = require('../config/connection');
const { User, Post, Commect } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDb = async () => {
    await sequelize.sync({ force: true });

    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    await Post.bulkCreate(postData);
    await Comment.bulkCreate(commentData);

    process.exit(0);
};

seedDb();