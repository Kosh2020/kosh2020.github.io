import React from 'react';
import './header.scss';
import Logo from '../../img/logo.png';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = (props) => (
  <header className="header">
    <div className="container-header" style={{ minWidth: props.minWidth }}>
      <a href="https://kosh2020.github.io/" className="logo">
        <img src={Logo} alt="logo" />
      </a>
      <nav className="menu">
        <ul>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/about">О галерее</Link>
          </li>
          <li>
            <Link to="/contacts">Контакты</Link>
          </li>
        </ul>
      </nav>
      <div className="hamburger-menu">
        <input id="menu__toggle" type="checkbox" />
        <label className="menu__btn" htmlFor="menu__toggle">
          <span></span>
        </label>
        <ul className="menu__box">
          <li>
            <Link className="menu__item" to="/">
              Главная
            </Link>
          </li>
          <li>
            <Link className="menu__item" to="/about">
              О галерее
            </Link>
          </li>
          <li>
            <Link className="menu__item" to="/contacts">
              Контакты
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </header>
);

const MemoHeader = React.memo(Header);

export default MemoHeader;

Header.propTypes = {
  minWidth: PropTypes.number,
};
