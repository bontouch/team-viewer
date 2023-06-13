const cors = require("cors");

const applyCorsMiddleWare = (handler) => (req, res) => {
  const options = {
    origin: [
      /https:\/\/team-viewer-91062.web.app.*/,
      "https://team-viewer-91062.web.app",
      /https:\/\/team-viewer-91062.firebaseapp.com.*/,
      "https://team-viewer-91062.firebaseapp.com",
      "https://teams.bontouch.dev",
      /https:\/\/teams.bontouch.dev.*/,
    ],
  };
  cors(options)(req, res, () => handler(req, res));
};

module.exports = applyCorsMiddleWare;
