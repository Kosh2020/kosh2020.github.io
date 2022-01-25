import React from 'react';
import './Preloader.scss';
import preloader from './img/preload.gif';

const Preloader = () => (
  <div className="preloader" >
    <img alt="Данные загружаются" src={preloader} />
  </div>
);

export default Preloader;