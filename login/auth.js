// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut,createUserWithEmailAndPassword, signInWithEmailAndPassword ,GoogleAuthProvider,signInWithPopup,GithubAuthProvider,sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBI_bHdk1Zx6-mD8oOT8JsQhtdl0H6QP1c",
    authDomain: "house-rental-fd97d.firebaseapp.com",
    projectId: "house-rental-fd97d",
    storageBucket: "house-rental-fd97d.appspot.com",
    messagingSenderId: "338300928463",
    appId: "1:338300928463:web:410b85334033c01bfd12ba",
    measurementId: "G-TLKG5DWQQX"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check authentication state and update UI
onAuthStateChanged(auth, (user) => {
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");

  if (user) {
    // User is signed in
    if (loginButton) loginButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "block";
  } else {
    // User is signed out
    if (loginButton) loginButton.style.display = "block";
    if (logoutButton) logoutButton.style.display = "none";
  }
});

// Logout function
function logout() {
  signOut(auth).then(() => {
    window.location.href = '../index.html';
  }).catch((error) => {
    console.error("Error signing out: ", error);
  });
}
// Login redirection function
function redirectToLogin() {
    window.location.href = 'login/login.html';
  }
  
function redirectToLoginforaddpro(){
    window.location.href = '../login/login.html';
}
function move(){
    window.location.href = '../login/login.html';

}
function propertieslogin(){
    window.location.href = '../login/login.html';
}
  window.logout = logout;
  window.redirectToLogin = redirectToLogin;
  window.redirectToLoginforaddpro = redirectToLoginforaddpro;
    window.move = move;
    window.propertieslogin = propertieslogin;