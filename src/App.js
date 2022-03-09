import React from 'react';
import { Route } from 'react-router-dom';
import './App.scss';
import './css/header.scss';
import './css/footer.scss';
import Logo from './img/logo.png';
import preloader from './img/preload.gif';
import { Link } from 'react-router-dom';
import Uploader from './components/uploader/uploader';
import Gallery from './components/gallery/gallery';

const arrExtnsFile = {
  json: ['json'],
  img: ['jpg', 'jpeg', 'png'],
};

const paramsGlr = {
  widthRowMin: 320,
  sizeImgMax: 2000,
  widthRowMax: 860,
  heightRowMax: 270,
  heightRowMin: 170,
  minimumFileSize: 10,
  maximumFileSize: 1000000,
};

const Preloader = () => (
  <div className="preloader">
    <img className="preloader-img" alt="Данные загружаются" src={preloader} />
  </div>
);

const Header = () => (
  <header className="app-wrapper-header">
    <a href="https://kosh2020.github.io/" className="header-logo">
      <img src={Logo} alt="logo" />
    </a>
    <nav className="header-menu">
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
    <div className="header-hamburger-menu">
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
  </header>
);

const Footer = () => (
  <div className="footer">
    <div className="footer-container" >
      <Link className="footer-link" to="/about">
        <span>GALLERY</span>
      </Link>
      <p className="footer-text">
        <span>Designed by</span>
      </p>
      <Link className="footer-link" to="/contacts">
        <span>Кошевая Е.А.</span>
      </Link>
    </div>
  </div>
);

const About = () => (
  <div className="about">
          Компонент загрузки картинок.
    <br />
    Разработан на ReactJS 17.0.2, Node v17.3.1
    <br />
    Реализован в виде поля ввода и кнопки “Загрузить”. <br />
    В поле можно ввести url до картинки или загрузить файл со списком картинок
    <br />
    (формат файла — JSON, пример :<a href="https://kosh2020.github.io/1/img.json" target="_blank" rel="noreferrer"> https://kosh2020.github.io/1/img.json</a>).
    <br />
    Есть возможность загрузить JSON файл или картинку с локальной машины.  
    <br />
    Для этого очистите поле ввода и нажмите кнопку загрузки, откроется диалоговое окно для выбора файла.
    <br />
    После выбора файла компонент либо загрузит его, либо выдаст сообщение об ошибке.
    <br />
    После загрузки изображений в галереи они отображаются в виде превью и располагаются рядами. 
    <br />
    Количество рядов не ограничено.
    <br />
    Ряды одинаковые по ширине, но могут различаться по высоте. <br />
    Все картинки в одном ряду одинаковые по высоте.
    <br />
    У картинок сохранены пропорции.
    <br />
    Интерфейс responsive, максимальная ширина контейнера — 860 px, минимальная – 320 px.
    <br />
    Количество картинок в каждом ряду не фиксировано.
    <br /> 
    При сужении/расширении галереи их количество может меняться. 
    <br />
    Картинки можно удалить из галереи, нажав по иконке в левом нижнем углу соответствующего изображения.
    <br />
    Без использования сторонних библиотек построения галереи.
    <br />
    Максимальный размер загружаемого файла 1Мб,
    <br />
    разрешение изображений от: ширина-320px, высота-170px до 2000px по большей стороне.
    <br /> <br />
    Для сборки: загрузить исходный код c   
    <span> <a href="https://github.com/Kosh2020/gallery.git" target="_blank" rel="noreferrer">
          https://github.com/Kosh2020/gallery.git
    </a></span>
    , <br />
    установить необходимые зависимости через npm install.
  </div>
);


const Contacts = () => (
  <div className="contact">
    Кошевая Екатерина
    <br />
    сот.тел.: <a href="tel:+79278213885">+79278213885</a>
    <br />
    email: <a href="mailto:uea06@mail.ru">uea06@mail.ru</a>
  </div>
);


class App extends React.PureComponent {
  constructor() {
    super();
    this.getImagesFromURL = this.getImagesFromURL.bind(this);
    this.refWrapp = React.createRef();
    this.state = {
      urlList:[],
      file:'',
    };
  }

  deleteImg = (i) => {
    const imageList = [...this.state.currentImageList];
    let beforeDeleteItems = imageList.filter((item) => item.i < i);
    const afterDeleteItems = imageList.filter((item) => item.i > i);
    let newImageList = [];
    if (afterDeleteItems.length === 0) {
      newImageList = beforeDeleteItems;
    } else {
      newImageList = this.updateImageList(afterDeleteItems, beforeDeleteItems);
    }
    this.setState({ currentImageList: newImageList,
    scrollTop: this.ref.scrollTop });
  };

  getImagesFromURL(urlList, typeFile, file ) {
    if (!file) file='';
    this.setState({ urlList: urlList, file: file});
  }

  render() {
    return (
      <>
        <div className="app-wrapper" ref={this.refWrapp} style={{ minWidth: paramsGlr.widthRowMin }}>
          <Header  />
          <div className="app-wrapper-content" ref={this.ref} style={{ maxWidth: paramsGlr.widthRowMax }}>
            <h1 className="content-title">Галерея изображений</h1>
            <Route
              exact={true}
              path="/"
              render={() => (
                <>
                  <Uploader getURL={this.getImagesFromURL} arrExtnsFile={arrExtnsFile} paramsGlr />
                  

                  {this.state.loading && <Preloader />}
                  <Gallery
                    urlList={this.state.urlList}
                    file={this.state.file}
                    paramsGlr={paramsGlr}
                    refWrapp={this.refWrapp}
                  />
                </>
              )}
            />
            <Route exact={true} path="/about" render={() => <About />} />
            <Route exact={true} path="/contacts" render={() => <Contacts />} />
          </div>
          <Footer />
        </div>
      </>
    );
  }

}
export default App;
