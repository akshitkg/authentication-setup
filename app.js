const express = require("express");
const app = express();
const session = require("express-session");
const redis = require("redis");
const redisStore = require("connect-redis")(session);
const nconf = require("nconf");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const path = require("path");

// Load Config file
nconf.argv();
nconf.env();
nconf.file({
  file: __dirname + "/config.json",
});

// Connect to Redis session store
const redisSessionStore = redis.createClient(
  nconf.get("redisPort"),
  nconf.get("redisHost"),
  {
    db: 0,
  }
);

redisSessionStore.on("connect", () => {
  console.log(
    `${chalk.green("✔️")} Connected to ${chalk.green("Redis")} Session store`
  );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Session store
app.use(
  session({
    secret: nconf.get("sessionsecret"),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // One week
    },
    store: new redisStore({ client: redisSessionStore }),
    resave: false,
    saveUninitialized: false,
  })
);

app.set("views", path.join(__dirname, "/views"));
app.engine("html", require("ejs").renderFile);

// Routes
app.use("/", require("./routes/static"));
app.use("/users", require("./routes/users"));

// Start the app
app.listen(nconf, get("port") || 3000);
console.log("Server is up");
