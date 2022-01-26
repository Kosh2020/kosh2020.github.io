import React from 'react';

import './App.scss';

import Uploader from './components/uploader/Uploader';

import Gallery from './components/gallery/Gallery';

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

  minimumFileSize: 1000,

  maximumFileSize: 1000000,
};

class App extends React.PureComponent {
  constructor() {
    super();

    this.getImagesFromURL = this.getImagesFromURL.bind(this);

    this.state = {
      imageList: [],
    };
  }

  getImagesFromURL(url) {
    this.setState({ imageList: url });
  }

  render() {
    console.log('RENDER-APP');

    return (
      <div className="container" style={{ maxWidth: this.state.widthRow }}>
        <Uploader getURL={this.getImagesFromURL} arrExtnsFile={arrExtnsFile} />

        <Gallery
          imageList={this.state.imageList}
          paramsGlr={paramsGlr}
          arrExtnsFile={arrExtnsFile}
        />
      </div>
    );
  }
}

export default App;
