import firebase from 'firebase';

const today = new Date();
const year = today.getFullYear();
const date = today.getDate();
const month = today.getMonth();
const hour = today.getHours();
const minutes = today.getMinutes();
const config = {
  apiKey: "AIzaSyDjQJOScdSQ5CAV-YNuf-vzxgh4GOvRlwc",
  authDomain: "firematters-cbaf0.firebaseapp.com",
  databaseURL: "https://firematters-cbaf0.firebaseio.com",
  projectId: "firematters-cbaf0",
  storageBucket: "firematters-cbaf0.appspot.com",
  messagingSenderId: "544850561778"
};
firebase.initializeApp(config);

export const emailregex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
export const fulldate = date + '/' + month + '/' + year + ' ' + hour + ':' + minutes;