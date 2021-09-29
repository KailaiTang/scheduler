import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';
import { TermButton } from '../components/CourseList';
import { terms } from './times';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBCQQhCIFW-nefn5_zKn8TEMEuZxn-VQto",
    authDomain: "actions-builder-sdk-3a084.firebaseapp.com",
    databaseURL: "https://actions-builder-sdk-3a084.firebaseio.com",
    projectId: "actions-builder-sdk-3a084",
    storageBucket: "actions-builder-sdk-3a084.appspot.com",
    messagingSenderId: "800885434356",
    appId: "1:800885434356:web:d1a5b33260fcb601eafba1"
  };

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
    return [data, loading, error];
  };

export const setData = (path, value) => (
  set(ref(database, path), value)
);

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const SignInButton = () => (
  <button className="btn btn-secondary btn-sm"
      onClick={() => signInWithGoogle()}>
    Sign In
  </button>
);

const TermSelector = ({term, setTerm}) => {
  const [user] = useUserState();
  return
    <div className="btn-toolbar justify-content-between">
      <div className="btn-group">
      { 
        Object.values(terms).map(
          value => <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />
        )
      }
      </div>
      { user ? <SignOuButton /> : <SignInButton /> }
    </div>
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

const SignOuButton = () => (
  <button className="btn btn-secondary btn-sm"
      onClick={() => signOut()}>
    Sign Out
  </button>
);

export const useUserState = () => {
    const [user, setUser] = useState();
  
    useEffect(() => {
      onIdTokenChanged(getAuth(firebase), setUser);
    }, []);
  
    return [user];
  };
  

// export const useUserState = () => useAuthState(firebase.auth());

