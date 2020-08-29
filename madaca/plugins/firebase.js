import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDd7I-b7Dx5rR9nt4mbivh5zAc8Yj3rCC8',
  authDomain: 'madaca-app.firebaseapp.com',
  databaseURL: 'https://madaca-app.firebaseio.com',
  projectId: 'madaca-app',
  storageBucket: 'madaca-app.appspot.com',
  messagingSenderId: '37648714015',
  appId: '1:37648714015:web:e07846e66de01cba02c82a',
  measurementId: 'G-ER0T96DZDW'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const functions = firebase.functions()

const storageService = firebase.storage()
export const storage = storageService.ref()
