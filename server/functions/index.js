const express = require("express");
const { expressjwt } = require("express-jwt");
const functions = require("firebase-functions");
require("firebase-functions/logger/compat");
const resizeAndStoreImagesFromHiBob = require("./compressAndUpload/resizeAndStoreImagesFromHiBob");
const getTeams = require("./getTeams");
const authWithGoogle = require("./AuthWithGoogle");
const applyCorsMiddleWare = require("./applyCorsMiddleWare");
const getAvatars = require("./getAvatars");
const getMaxAge = require("./getMaxAge");

const app = express();

app.use(
  expressjwt({
    secret: () => process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({ path: ["/token"] })
);

//start script here to set both the hibob and images. Then update the 3 variables.

app.post("/token", async (req, res) => {
  try {
    const token = await authWithGoogle(req.body.signInToken);

    res.json({
      token,
    });
  } catch (err) {
    res.status(401).send(err);
  }
});

app.get("/avatars", async (req, res) => {
  if (!app.settings.avatars) {
    try {
      const avatars = await getAvatars(app)();
      app.set("avatars", avatars);

      res
        .set("Cache-control", `max-age=${getMaxAge()}`)
        .status(200)
        .send(avatars);
    } catch (e) {
      res.status(500).send(e);
    }
  } else {
    res
      .set("Cache-control", `max-age=${getMaxAge()}`)
      .status(200)
      .send(app.settings.avatars);
  }
});

app.get("/teams", async (req, res) => {
  if (!app.settings.teams) {
    try {
      const teams = await getTeams();
      app.set("teams", teams);
      res
        .set("Cache-control", `max-age=${getMaxAge()}`)
        .status(200)
        .send(teams);
    } catch (e) {
      res.status(500).send(e);
    }
  } else {
    res
      .set("Cache-control", `max-age=${getMaxAge()}`)
      .status(200)
      .send(app.settings.teams);
  }
});
//0 0 * * * a day
//30 0 * * * a day at 00:30
//*/5 * * * * every 5 minute

exports.app = functions
  .runWith({
    secrets: ["HIBOB_API_KEY", "GOOGLE_AUTH_CLIENT_ID", "JWT_SECRET"],
    memory: "4GB",
  })
  .https.onRequest(applyCorsMiddleWare(app));

exports.hibobBatchJob = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "4GB",
    secrets: ["HIBOB_API_KEY", "GOOGLE_AUTH_CLIENT_ID"],
  })
  .pubsub.schedule("3 * * * *")
  .timeZone("Europe/Stockholm")
  .onRun(async () => {
    await resizeAndStoreImagesFromHiBob();
    const avatars = await getAvatars(app);
    app.set("avatars", avatars);
    const teams = await getTeams();
    app.set("teams", teams);
  });
