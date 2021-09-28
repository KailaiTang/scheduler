import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';

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