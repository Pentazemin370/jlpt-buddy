import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import parse from 'html-react-parser';

export const Main = ({ content, checkmarks, setCheckmarks }) => {

    const [list, setList] = useState(null);
    const [category, setCategory] = useState('n5-grammar');
    const [touchStartX, setTouchStartX] = useState(0);
    const location = useLocation();

    const handleClick = (e) => {
        // e.stopPropagation();
        if (!(e.target instanceof HTMLInputElement)) {
            e.preventDefault();
            const link = e.currentTarget.querySelector('a');
            if (link && link.href) {
                window.open(link.href);
            }
        }
    }
    const handleTouchStart = (e) => {
        if (e.changedTouches[0] && e.changedTouches[0].screenX) {
            setTouchStartX(e.changedTouches[0].screenX);
        }
    };
    const handleTouchEnd = (e, index) => {
        if (e.changedTouches[0] && e.changedTouches[0].screenX && touchStartX) {
            const touchEndX = e.changedTouches[0].screenX;
            if (Math.abs(touchEndX - touchStartX) > 100) {
                const temp = { ...checkmarks };
                temp[index] = temp[index] ? false : true;
                localStorage.setItem(`jlpt-checkmarks-${category}`, JSON.stringify(temp));
                setCheckmarks(temp);
            }
        }
    };

    useEffect(() => {
        if (location && location.pathname) {
            const s = /([a-zA-Z0-9-])+/.exec(location.pathname);
            if (s && s[0]) {
                console.log(s);
                setCategory(s[0]);
                setList(content[category]);
            }
        }
    }, [location, content, category]);



    return <div className="container">
        <main>
            <table>
                <tbody>
                    {list && checkmarks ? list.map((li, index) => {
                        if (li) {
                            return <tr key={index}
                                onClick={handleClick}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={(e) => handleTouchEnd(e, index)}
                                className={`${!!checkmarks[index] ? 'complete' : ''}`}>
                                <td>
                                    <div>
                                        <input type="checkbox" checked={!!checkmarks[index]}
                                            onChange={
                                                (evt) => {
                                                    const temp = { ...checkmarks };
                                                    temp[index] = evt.target.checked;
                                                    localStorage.setItem(`jlpt-checkmarks-${category}`, JSON.stringify(temp));
                                                    setCheckmarks(temp);
                                                }} />
                                    </div>
                                </td>
                                {parse(li)}
                            </tr>
                        }
                        return null;
                    }) : null}
                </tbody>
            </table>
        </main>
    </div>

}