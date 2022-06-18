const path = require("path");
const express = require("express");
const controller = require("./controllers");
const sequelize = require("./config/connection");
const exphbs = require("express-handlebars");
const SequlizeStore = require("connect-session-sequelize")(session.Store);
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3001;


const sess = {
  secret: "secret",
  cookie: {},
  saveUninitialized: true,
  resave: false,
  store: new SequlizeStore({
    db: sequelize
  })
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session(sess));
app.use("/", controller);
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});