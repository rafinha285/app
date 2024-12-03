import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth"

export const firebaseConfig = {
    apiKey: "AIzaSyBvhUM-MOU-wL30Fw_atucwtoAOj6wqzrw",
    authDomain: "animefoda-11e67.firebaseapp.com",
    projectId: "animefoda-11e67",
    storageBucket: "animefoda-11e67.firebasestorage.app",
    messagingSenderId: "1015751620627",
    appId: "1:1015751620627:web:a01646196c1d5733f027e6",
    measurementId: "G-QH1T3DQMST"
};
export const firebaseApp = initializeApp(firebaseConfig);
export const analytcs = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp)
