const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const path = require('path');
const fs = require('fs');

// Attempt to load the service account key
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    // Decode base64 to JSON
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    serviceAccount = JSON.parse(decoded);
} else {
    const serviceAccountPath = path.join(__dirname, '../Config/transport-management-cb902-firebase-adminsdk-fbsvc-54d2b703c5.json');
    if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = require(serviceAccountPath);
    }
}

if (serviceAccount) {
    initializeApp({
        credential: cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully.');
} else {
    console.warn('Firebase Service Account Key not found via Env or Config/firebase-service-account.json. Push notifications will fail.');
}

/**
 * Send a push notification to a single device via FCM
 * @param {string} token - The FCM device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body/message
 * @param {object} data - Optional data payload
 */
exports.sendPushNotification = async (token, title, body, data = {}) => {
    try {
        if (!token) return;
        
        const message = {
            notification: {
                title,
                body
            },
            data,
            token
        };

        const response = await getMessaging().send(message);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

/**
 * Send a push notification to multiple devices via FCM
 * @param {Array<string>} tokens - Array of FCM device tokens
 * @param {string} title - Notification title
 * @param {string} body - Notification body/message
 * @param {object} data - Optional data payload
 */
exports.sendMulticastNotification = async (tokens, title, body, data = {}) => {
    try {
        if (!tokens || tokens.length === 0) return;

        const message = {
            notification: {
                title,
                body
            },
            data,
            tokens
        };

        const response = await getMessaging().sendEachForMulticast(message);
        console.log(response.successCount + ' messages were sent successfully');
        return response;
    } catch (error) {
        console.error('Error sending multicast push notification:', error);
    }
};
