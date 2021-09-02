import './App.scss';
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore/lite';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { VocabTest } from './components/Test/Test';
import { SideMenu } from './components/SideMenu/SideMenu';
import { Main } from './components/Main/Main';

const firebaseConfig = {
  apiKey: "AIzaSyCnjrJTMo8Yr0bQ7Z8YXQgbVNX98usrHho",
  authDomain: "saltybread-221fd.firebaseapp.com",
  databaseURL: "https://saltybread-221fd.firebaseio.com",
  projectId: "saltybread-221fd",
  storageBucket: "saltybread-221fd.appspot.com",
  messagingSenderId: "1091174055877",
  appId: "1:1091174055877:web:1037e06fd0c14226ab15ac"
};

function App() {
  const [category, setCategory] = useState<string>('n5-grammar');
  const [content, setContent] = useState<Object>(null);
  const [list, setList] = useState<any[]>([]);
  const [checkmarks, setCheckmarks] = useState<{}>({});
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    (async () => {
      if (!content) {
        const documentRef = await getDoc(doc(db, "main", "content"));
        const data = documentRef.data();
        setContent(data);
      } else if (category) {
        setList(content[category]);
        const documentRef = await getDoc(doc(db, 'main', `jlpt-checkmarks-${category}`));
        const globalCheckmarks = documentRef.data();
        const localCheckmarks = localStorage.getItem(`jlpt-checkmarks-${category}`);
        if (globalCheckmarks) {
          if (localCheckmarks) {
            Object.assign(globalCheckmarks, JSON.parse(localCheckmarks));
          }
          setCheckmarks(globalCheckmarks);
        } else if (localCheckmarks) {
          setCheckmarks(localCheckmarks);
        } else {
          setCheckmarks({});
        }
      }
    })();
  }, [content, category, db]);

  document.onkeydown = async (e) => {
    if (e.key === "s" && e.ctrlKey) {
      e.preventDefault();
      if (!authenticated) {
        try {
          const auth = getAuth();
          const password = prompt('');
          const credentials = await signInWithEmailAndPassword(auth, 'dennishpark@gmail.com', password);
          if (credentials.user && credentials.user.uid) {
            setAuthenticated(true);
          }
        } catch {
          console.log('hello');
        }
      }
      setDoc(doc(db, 'main', `jlpt-checkmarks-${category}`), checkmarks);
    }
  }

  if (content) {
    return (
      <Router>
        <div className="App">
          <SideMenu />
          <Switch>
            <Route path="/vocab-test">
              <VocabTest list={list} content={content} setCategory={setCategory} setList={setList} />
            </Route>
            <Route path="/">
              <Main checkmarks={checkmarks} setCheckmarks={setCheckmarks} content={content} />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
  return null;
}

export default App;
