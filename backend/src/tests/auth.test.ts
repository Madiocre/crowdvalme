import { adminAuth, adminDb } from '../config/firebaseAdmin';

async function testUserAuthentication() {
  try {
    // 1. Create a test user
    const userEmail = "test@example.com";
    const userPassword = "testPassword123!";
    
    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: userEmail,
      password: userPassword,
      emailVerified: true
    });

    console.log('Test user created:', userRecord.uid);

    // 2. Create a custom token
    const customToken = await adminAuth.createCustomToken(userRecord.uid);
    console.log('Custom token created:', customToken);

    // 3. Create user document in Firestore
    await adminDb.doc(`users/${userRecord.uid}`).set({
      uid: userRecord.uid,
      email: userEmail,
      displayName: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log('User document created in Firestore');

    // 4. Clean up (optional)
    // Uncomment these lines if you want to delete the test user after testing
    /*
    await adminAuth.deleteUser(userRecord.uid);
    await adminDb.doc(`users/${userRecord.uid}`).delete();
    console.log('Test user cleaned up');
    */

    return {
      uid: userRecord.uid,
      customToken
    };
  } catch (error) {
    console.error('Error in test:', error);
    throw error;
  }
}

// Run the test
testUserAuthentication()
  .then(({ customToken }) => {
    console.log('\nTest the API with these cURL commands:');
    console.log('\n1. Get user data:');
    console.log(`curl -X GET \\
  http://localhost:5000/api/user \\
  -H 'Authorization: Bearer ${customToken}'`);
  })
  .catch(console.error);