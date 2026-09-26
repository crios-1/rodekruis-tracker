const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = import.meta.env.VITE_DEMO_MODE !== 'true'
  && Object.values(config).every(Boolean);

let firebasePromise;

export function getFirebase() {
  if (!firebaseConfigured) return Promise.resolve(null);
  if (!firebasePromise) {
    firebasePromise = Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]).then(([appSdk, authSdk, firestoreSdk]) => {
      const app = appSdk.getApps()[0] ?? appSdk.initializeApp(config);
      return {
        auth: authSdk.getAuth(app),
        db: firestoreSdk.getFirestore(app),
        googleProvider: new authSdk.GoogleAuthProvider(),
        ...authSdk,
        ...firestoreSdk,
      };
    });
  }
  return firebasePromise;
}
