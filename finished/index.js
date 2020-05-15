const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

// setup the API to have admin privlages
// this uses the builtin FIREBASE_CONFIG environment variables and a JSON file pulled from the console
// https://firebase.google.com/docs/functions/config-env
// https://firebase.google.com/docs/admin/setup#initialize-sdk
const serviceAccount = require('./service-account/permissions.json');
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

// create reference to the database for firestore here
const db = admin.firestore();

// refactored firstore interaction into its own file
const firestore = require('./firestore/firestore');

app.get('/api/hello-world', (req, res) => {
    res.status(200).send('hello world');
});

app.post('/api/clock-in', (req, res) => {
    (async () => {
        try {
            // first get length so it can be used as an id
            let length = await firestore.getLength(db);
            length = length + 1;
            // create the record for the clock in here
            await firestore.clockIn(db, req.body.project, length);
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.put('/api/clock-out', (req, res) => {
    (async () => {
        try {
            // select the newest record to add a clock out value to
            let length = await firestore.getLength(db);
            if (length === undefined) {
                res.status(500).send('no values were found');
            }

            const clock = await firestore.clockOut(db, length);
            return res.status(200).send(clock);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/select-all', (req, res) => {
    (async () => {
        try {
            const allRecords = await firestore.selectAll(db);
            res.status(200).send(allRecords);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.delete('/api/delete-all', (req, res) => {
    (async () => {
        try {
            await firestore.deleteAll(db);
            res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);
