import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import './Test.scss';
export function VocabTest({ setList, setCategory, content, list }) {
  const [pages, setPages] = useState(null);
  const [pageNum, setPageNum] = useState(0);
  const [active, setActive] = useState({});
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    setCategory('n5-vocabulary');
    setList(content['n5-vocabulary']);
    if (!pages) {
      let _list = [...list];
      let a = _list.length;
      let b;
      while (a) {
        b = Math.floor(Math.random() * a);
        [_list[a], _list[b]] = [_list[b], _list[a]]
        a--;
      }
      let _pages = [];
      while (_list.length) {
        _pages.push(_list.splice(0, 10));
      }
      setPages(_pages);
    }
  }, [content, pages, list, setCategory, setList]);

  const readText = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.speechSynthesis.speaking) {
      let speech = new SpeechSynthesisUtterance();
      speech.lang = 'ja-Jpan-JP';
      let temp = document.createElement('div');
      temp.innerHTML = item;
      let text = temp.querySelector('a').innerText;
      speech.text = text;
      window.speechSynthesis.speak(speech);
    }
  };

  const flipCard = (e, index) => {
    e.preventDefault();
    let temp = { ...active };
    temp[index] = !!!temp[index];
    setActive(temp);
  }


  const handleTouchStart = (e, item) => {
    readText(e, item);
    if (e.changedTouches[0] && e.changedTouches[0].screenX) {
      setTouchStartX(e.changedTouches[0].screenX);
    }
  };

  const handleTouchEnd = (e, index) => {
    if (e.changedTouches[0] && e.changedTouches[0].screenX && touchStartX) {
      const touchEndX = e.changedTouches[0].screenX;
      if (Math.abs(touchEndX - touchStartX) > 100) {
        flipCard(e, index);
      }
    }
  };


  return <main className="test">
    <div className="buttonsContainer">
      <button className="pageButton" onClick={() => {
        if (pageNum > 0)
          setPageNum(pageNum - 1)
      }}>Prev</button>
      <button className="pageButton" onClick={() => {
        if (pageNum < pages.length - 1)
          setPageNum(pageNum + 1)
      }}>Next</button>
    </div>
    <table>
      <tbody>
        {pages && pages[pageNum] ? pages[pageNum].map((li, index) => {
          if (li) {
            return <tr className={!!active[index] ? 'active' : ''} key={index}
              onTouchStart={(e) => handleTouchStart(e, li)}
              onTouchEnd={(e) => handleTouchEnd(e, index)}
              onClick={(e) => readText(e, li)} onContextMenu={(e) => flipCard(e, index)}>
              {parse(li)}
            </tr>
          }
          return null;
        }) : null}
      </tbody>
    </table>
  </main>;
}