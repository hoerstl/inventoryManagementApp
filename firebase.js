import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';




const firebaseConfig = {
  apiKey: "AIzaSyAKMIKFj14UXnCELzkSB_gK0K1v3S1TrBU",
  authDomain: "inventory-management-app-1b660.firebaseapp.com",
  projectId: "inventory-management-app-1b660",
  storageBucket: "inventory-management-app-1b660.appspot.com",
  messagingSenderId: "28587605803",
  appId: "1:28587605803:web:367264427e95b6b38f0f6e",
  measurementId: "G-K5NL5EHWWJ"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const firestore = getFirestore(app);




export { app, firestore };

