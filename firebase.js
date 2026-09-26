const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./kalam-learning-platfrom-firebase-adminsdk-fbsvc-42692a3374.json");

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;