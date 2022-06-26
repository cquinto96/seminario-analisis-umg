import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,

  authDomain: process.env.REACT_APP_AUTHDOMAIN,

  projectId: process.env.REACT_APP_PROJECTID,

  storageBucket: process.env.REACT_APP_STORAGEBUCKET,

  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,

  appId: process.env.REACT_APPID,
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


export const filtrarUsuario = async (
  uuid
) => {
  const fromQuery = query(collection(db, "usuarios"), where("id", "==", uuid));
  const querySnapshot = await getDocs(fromQuery);
  return querySnapshot;
};