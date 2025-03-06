/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const resetTokens = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.uid !== 'YOUR_ADMIN_UID') {
    throw new functions.https.HttpsError('permission-denied', 'Only admin can reset tokens');
  }
  const usersSnapshot = await admin.firestore().collection('users').get();
  const batch = admin.firestore().batch();
  usersSnapshot.forEach((doc) => {
    batch.update(doc.ref, { tokensAvailable: 5 });
  });
  await batch.commit();
  return { message: 'Tokens reset successfully' };
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
