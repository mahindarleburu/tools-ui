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

// Production Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIKdPiu16H8gaY6PjGI5LB1cooNOGOhGQ",
  authDomain: "connectwyze-prod.firebaseapp.com",
  projectId: "connectwyze-prod",
  storageBucket: "connectwyze-prod.appspot.com",
  messagingSenderId: "604907096963",
  appId: "1:604907096963:web:5143e08bea23d5b4d644b6"
};


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
