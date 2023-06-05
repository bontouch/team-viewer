const { OAuth2Client } = require('google-auth-library');

const applyAuthMiddleware = (handler) => (req, res) => {
    const authHeader = req.headers['authorization'];
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: authHeader,
            audience: process.env.GOOGLE_AUTH_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        return payload['hd'];
    }
    const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);
    if (typeof authHeader !== 'undefined') {
        verify()
            .then((hd) => {
                if (hd === 'bontouch.com') {
                    console.log('success');
                    return handler(req, res);
                } else {
                    res.status(403).send(
                        'your user is not part of the bontouch.com domain'
                    );
                }
            })
            .catch(console.error);
    } else {
        res.status(401).send('Missing authorization header!');
    }
};

module.exports = applyAuthMiddleware;
