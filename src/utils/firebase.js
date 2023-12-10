// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  query,
  getDocs,
  where,
  orderBy,
  limit,
  updateDoc,
  addDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Production Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1FpJMHtOeeJ2w_3W4tJW-qXri4_Fmt0E",
  authDomain: "carsome-martech-tools.firebaseapp.com",
  projectId: "carsome-martech-tools",
  storageBucket: "carsome-martech-tools.appspot.com",
  messagingSenderId: "399957821777",
  appId: "1:399957821777:web:51b2771f053f44101c2b70",
};

// Staging Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCNBQMGy8X7_my2sw_MYGXfuwsZxJYa5ag",
//   authDomain: "carsome-c8058.firebaseapp.com",
//   projectId: "carsome-c8058",
//   storageBucket: "carsome-c8058.appspot.com",
//   messagingSenderId: "402850768952",
//   appId: "1:402850768952:web:506a3fe86e9ee0adba5ecd",
//   measurementId: "G-NWRHLJ7TSE",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
  hd: "carsome.com",
});

const auth = getAuth(app);

const signInWithGooglePopup = (menuName) => {
  window.analytics.track(menuName+" Button Clicked", {
    "page_name": 'login',
    "url_path": window.location.host + '' + window.location.pathname,
    "full_url": window.location.href,
});
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log(error);
    });
};

const getCurrentUser = () => {
  onAuthStateChanged(auth, (user) => {
    // console.log(user)
    if (user) {
      return user;
      // ...
    } else {
      // User is signed out
      // ...
      return;
    }
  });
};

const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
  const userDocRef = doc(db, "users", userAuth.uid);
  const userActivityRef = collection(db, "activity_logs");
  const userSnapshot = await getDoc(userDocRef);
  const { displayName, email } = userAuth;
  const createdAt = new Date();
  const lastLoginAt = new Date();
  const defaultUserRole = "employee";
  if (!userSnapshot.exists()) {
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        lastLoginAt,
        role:defaultUserRole,
        ...additionalInformation,
      });
      await addDoc(userActivityRef, {
        uid: userAuth.uid,
        displayName,
        email,
        createdAt,
        lastLoginAt,
        role:defaultUserRole,
        ...additionalInformation,
      });
      window.analytics.identify(userAuth.uid, {
        name: userAuth.displayName,
        email: userAuth.email,
      });

      window.analytics.track("Signin Success", {
        path: window.location.host + "" + window.location.pathname,
        url: window.location.href,
      });
    } catch (error) {
      console.log("error while creating document", error.message);
    }
  } else {
    try {
      await updateDoc(userDocRef, {
        lastLoginAt,
        ...additionalInformation,
      });
      await addDoc(userActivityRef, {
        uid: userAuth.uid,
        displayName,
        email,
        createdAt,
        lastLoginAt,
        role:defaultUserRole,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error while creating document", error.message);
    }
    window.analytics.identify(userAuth.uid, {
      name: userAuth.displayName,
      email: userAuth.email,
    });

    window.analytics.track("Signin Success", {
      path: window.location.host + "" + window.location.pathname,
      url: window.location.href,
    });
  }
};

const signOutGoogle = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      sessionStorage.removeItem("lastLoginAt");
    })
    .catch((error) => {
      // An error happened.
    });
};

export { signInWithGooglePopup, auth, getCurrentUser, signOutGoogle, db, createUserDocumentFromAuth };
