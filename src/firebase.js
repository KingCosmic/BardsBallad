const firebase = require('firebase');

const app = firebase.initializeApp({
  apiKey: 'API_KEY',
  authDomain: 'AUTH_DOMAIN',
  databaseUrl: 'DATABASE_URL',
  projectId: 'PROJECT_ID',
  storageBucket: 'STORAGE_BUCKET',
  messagingSenderId: 'SENDER_ID'
});

export default app;

