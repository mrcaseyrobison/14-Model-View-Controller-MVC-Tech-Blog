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

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extrended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(routes);

// Turn on connection to database and server //
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log("Now listening on port 3001"));
});