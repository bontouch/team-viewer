const express = require('express');
//const cors = require('cors');
const functions = require('firebase-functions');
require('firebase-functions/logger/compat');

const getHiBobEmployees = require('./getHiBobEmployees');
const resizeAndStoreImagesFromHiBob = require('./compressAndUpload/resizeAndStoreImagesFromHiBob');
const fetchCompressedAvatar = require('./fetchCompressedAvatar');
const applyAuthMiddleware = require('./applyAuthMiddleWare');
const getTeams = require('./getTeams');

const app = express();
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });
// app.use(
//     cors({
//         origin: '*'
//     })
// );
// app.use(
//     cors({
//         origin: [
//             'https://team-viewer-91062.web.app',
//             'https://team-viewer-91062.firebaseapp.com'
//         ]
//     })
// );

app.get('/avatars', async (req, res) => {
    try {
        const employees = await getHiBobEmployees();
        const avatars = {};
        await Promise.allSettled(
            employees.map(async (employee) => {
                const avatarUrl = employee?.about?.avatar || employee.avatarUrl;
                if (
                    avatarUrl &&
                    !avatarUrl.toLowerCase().includes('default-avatars')
                ) {
                    const avatarDataUrl = await fetchCompressedAvatar(
                        employee.id
                    );
                    avatars[employee.id] = avatarDataUrl;
                }
            })
        );
        res.status(200).send(avatars);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get('/teams', async (req, res) => {
    try {
        const teams = await getTeams();
        res.status(200).send(teams);
    } catch (e) {
        res.status(500).send(e);
    }
});
//0 0 * * * a day
//*/5 * * * * every 5 minute

exports.app = functions
    .runWith({ secrets: ['HIBOB_API_KEY', 'GOOGLE_AUTH_CLIENT_ID'] })
    .https.onRequest(applyAuthMiddleware(app));

exports.hibobBatchJob = functions
    .runWith({
        timeoutSeconds: 300,
        memory: '4GB',
        secrets: ['HIBOB_API_KEY', 'GOOGLE_AUTH_CLIENT_ID']
    })
    .pubsub.schedule('0 0 * * *')
    .timeZone('Europe/Stockholm')
    .onRun(async () => {
        await resizeAndStoreImagesFromHiBob();
    });
