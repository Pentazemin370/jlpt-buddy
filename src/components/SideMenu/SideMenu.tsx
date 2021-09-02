
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import './SideMenu.scss';
import { useState } from 'react';

export const SideMenu = (props) => {
    const [show, setShow] = useState(false);
    return <section>
        <div className="nav-placeholder"></div>
        <div className="sidebar-nav">
            <button onClick={() => setShow(!show)} className="menu-button"><FontAwesomeIcon icon={faBars} /></button>
        </div>
        <div className={`sidebar-container ${show ? 'active' : ''}`}>
            <div className="category">Features</div>
            <Link className="level-2-category" to="/">N5</Link>
            <Link to="/n5-grammar">N5 Grammar</Link>
            <Link to="/n5-vocabulary">N5 Vocabulary</Link>
            <Link to="/n5-kanji">N5 Kanji</Link>
            <Link className="level-2-category" to="/vocab-test">Vocab Test</Link>
        </div>
    </section>;

}