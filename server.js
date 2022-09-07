// Requirements //
const express = require("express");
const routes = require("./controllers");
const path = require ("path");
const sequelize = require("./config/connection");

const helpers = require("./utils/helpers");
const handlebars = require("express-handlebars");
const hbs = exphbs.create({ helpers });

const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3001;

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
    secret: "bigbluedog",
    cookie: {
        // Session will automatically expire in 10 minutes //
        expires: 10 * 60 * 1000
    },
resave: true,
rolling: true,
saveUninitialized: true,
store: new SequelizeStore({
    db: sequelize
}),
};