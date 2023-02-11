// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//  import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	//  apiKey: "AIzaSyAfTPWUhiG_WpKk4tlwqN5ryTLCSJFwQ3A",
	apiKey: process.env.REACT_APP_FIREBASE_KEY,
	authDomain: "ktpmud-nhom12.firebaseapp.com",
	projectId: "ktpmud-nhom12",
	storageBucket: "ktpmud-nhom12.appspot.com",
	messagingSenderId: "65607578846",
	//  appId: "1:65607578846:web:82681d11efdb46c659be4f",
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
export { db, auth };
