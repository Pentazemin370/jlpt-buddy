import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [category, setCategory] = useState('n5-grammar');
  const [content, setContent] = useState(null);
  const [list, setList] = useState(null);
  const [checkmarks, setCheckmarks] = useState({});

  useEffect(() => {
    (async () => {
      if (!content) {
        const res = await fetch('./content.json');
        const json = await res.json();
        setContent(json);
      } else {
        setList(content[category]);
        if (localStorage.getItem(`jlpt-checkmarks-${category}`)) {
          setCheckmarks(JSON.parse(localStorage.getItem(`jlpt-checkmarks-${category}`)));
        }
      }
    })();
  }, [content, category]);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const link = e.currentTarget.querySelector('a');
    if (link && link.href) {
      try {
        require('electron').shell.openExternal(link.href);
      } catch {
        window.open(link.href);
      }
    }
  }
  if (content && list) {
    return (
      <div className="App">
        <div className="container">
          <header>
          <div className="nav-section">Category</div>
          <div className="navbar">
            {Object.keys(content).map(key =>
              <button
                className={`nav-button ${category === key ? 'active' : ''}`}
                onClick={() => setCategory(key)}
              >{key}</button>)}
          </div>
          </header>
          <main>
          <ol>
            {list.map((li, index) => {
              if (li) {
                return <li key={index}>
                  <input type="checkbox" checked={!!checkmarks[index]}
                    onChange={
                      (evt) => {
                        const temp = { ...checkmarks };
                        temp[index] = evt.target.checked;
                        localStorage.setItem(`jlpt-checkmarks-${category}`, JSON.stringify(temp));
                        setCheckmarks(temp);
                      }} />
                  <table dangerouslySetInnerHTML={{ __html: li }} onClick={handleClick}></table></li>
              }
              return null;
            })}
          </ol>
          </main>
        </div>
      </div>
    );
  }
  return null;
}

export default App;
