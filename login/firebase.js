
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,GoogleAuthProvider,signInWithPopup,GithubAuthProvider,sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBI_bHdk1Zx6-mD8oOT8JsQhtdl0H6QP1c",
    authDomain: "house-rental-fd97d.firebaseapp.com",
    databaseURL: "https://house-rental-fd97d-default-rtdb.firebaseio.com",
    projectId: "house-rental-fd97d",
    storageBucket: "house-rental-fd97d.appspot.com",
    messagingSenderId: "338300928463",
    appId: "1:338300928463:web:410b85334033c01bfd12ba",
    measurementId: "G-TLKG5DWQQX"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
const provider1 = new GithubAuthProvider();


function signup() {
    const firstname = document.getElementById("firstname").value;
    const email = document.getElementById("emailaddress").value;
    const password = document.getElementById("passcode").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {           
            const user = userCredential.user;
            return setDoc(doc(db, "users", user.uid), {
                name: firstname,
                email: email
            });
        })
        .then(() => {
            const signupMessageDiv = document.getElementById("signupmessage");
            if (signupMessageDiv) {
                signupMessageDiv.style.display = "block";
                signupMessageDiv.innerText = "User registered successfully!";
                window.location.href = '../index.html';
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = formatFirebaseErrorMessage(error.message);
            const signupMessageDiv = document.getElementById("signupmessage");
            if (signupMessageDiv) {
                signupMessageDiv.style.display = "block";
                signupMessageDiv.innerText = errorMessage;
            }
                        
        });
}


function signin() {
    const email = document.getElementById("mail").value;
    const password = document.getElementById("pass").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const signinMessageDiv = document.getElementById("signinmessage");
            if (signinMessageDiv) {
                signinMessageDiv.style.display = "block";
                signinMessageDiv.innerText = "User signed in successfully!";
                window.location.href = '../index.html';
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = formatFirebaseErrorMessage(error.message);
            const signinMessageDiv = document.getElementById("signinmessage");
            if (signinMessageDiv) {
                signinMessageDiv.style.display = "block";
                signinMessageDiv.innerText = errorMessage;
                signinMessageDiv.style.fontSize = "12px";
            }
        });
}


window.signup = signup;
window.signin = signin;


// google sign in

const googlesignin=document.getElementById("googlelogo");
const googlesignup=document.getElementById("googlelogosignup");
const userSignIn= async() => {
  signInWithPopup(auth,provider)
  .then((result) => {
    const user=result.user;
    console.log(user);
    window.location.href = '../index.html';
  })
  .catch((error) => {
    const errorMessage = formatFirebaseErrorMessage(error.message);
    console.log(errorMessage);
    });
}
googlesignin.addEventListener("click",userSignIn);
googlesignup.addEventListener("click",userSignIn);


// github login

const githublogin=document.getElementById("githublogo");
const githubsignup=document.getElementById("githublogosignup");
const userGithubLogin= async() => {
    signInWithPopup(auth,provider1)
    .then((result) => {
        const user=result.user;
        console.log(user);
        window.location.href = '../index.html';
    })
    .catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
    });
}
githublogin.addEventListener("click",userGithubLogin);
githubsignup.addEventListener("click",userGithubLogin);


// errormessage

function formatFirebaseErrorMessage(message) {
    // Customize this function to format the error message as desired
    if (message.includes("auth/email-already-in-use")) {
        return "Email address already in use.";
    }
    if (message.includes("auth/wrong-password")) {
        return "Your password is incorrect.";
    }
    if (message.includes("Error (auth/invalid-credential)")){
        return "Invalid credentials.";
    }
    // Add more cases as needed
    return message.replace("Firebase: ", "");
}

// forget password

const forget = document.getElementById("forgetpassword");

forget.addEventListener('click', () => {
    const email = document.getElementById("mail").value;
    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("A Password Reset Link has been sent to your email");
            })
            .catch((error) => {
                const errorMessage = formatFirebaseErrorMessage(error.message);
                console.log(errorMessage);
                alert(errorMessage);
            });
    } else {
        alert("Please enter your email address.");
    }
});


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
  
  window.logout = logout;