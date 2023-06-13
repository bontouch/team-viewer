const jsonwebtoken = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const authWithGoogle = async (signInToken) => {
  const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: signInToken,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    return payload["hd"];
  }
  try {
    const hd = await verify();
    if (hd === "bontouch.com") {
      return jsonwebtoken.sign({}, process.env.JWT_SECRET);
    }
  } catch (error) {
    return error;
  }
};

module.exports = authWithGoogle;
