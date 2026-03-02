import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxJoTlepKme73Imz9RcXHYJxr4rQxGyQQ",
  authDomain: "budget-planner-dashboard.firebaseapp.com",
  projectId: "budget-planner-dashboard",
  storageBucket: "budget-planner-dashboard.firebasestorage.app",
  messagingSenderId: "702453781419",
  appId: "1:702453781419:web:2751f14985ccc6e323f8ee",
  measurementId: "G-W7SW4QYN80"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
