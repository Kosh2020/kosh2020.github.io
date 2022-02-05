import React from 'react';
import {Route} from 'react-router-dom';
import './App.scss';
import Header from './components/header/header';
import Uploader from './components/uploader/uploader';
import Gallery from './components/gallery/gallery';
import Footer from './components/footer/footer';
import Preloader from './components/preloader/preloader';
import  About from './components/about/about';
import  Contacts from './components/contacts/contacts';
import { PreviewSize } from './components/preview-size';
import { FileAndImageSize } from './components/utils';



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

const BadImageMessage = (props) => {
  let badImageList = props.badImageList;
  let badImageMessage = [];

  if (badImageList.length > 0) {
    badImageMessage = badImageList.map((e, index) => [e, <br key={index} />]);
    badImageMessage.unshift(['Files were not uploaded: ', <br key="0" />]);
  }
  return badImageMessage;
};

const MemoBadImageMessage = React.memo(BadImageMessage);

class App extends React.PureComponent {
  constructor() {
    super();
    this.ref = React.createRef();
    this.getImagesFromURL = this.getImagesFromURL.bind(this);

    this.state = {
      currentImageList: [],
      badImageList: [],
      innerWidth: 0,
      loading: false,      
    };
  }

  updateImageList(ImgListWithoutPrSize,imgListForAdd) {
    let newImageList = [...imgListForAdd]
    ImgListWithoutPrSize.forEach((img) => {
      newImageList = PreviewSize(
        newImageList,
        img,
        this.state.innerWidth,
        paramsGlr
      );
    });
    return newImageList;
  }

  imageListAfterdeleteImg = (i) => {

    const imageList = [...this.state.currentImageList];
    let beforeDeleteItems = imageList.filter((item) => item.i < i);
    const afterDeleteItems = imageList.filter((item) => item.i > i);
    let newImageList = [];
    if (afterDeleteItems.length === 0) {
      newImageList = beforeDeleteItems;
    } else {
        newImageList = this.updateImageList(afterDeleteItems,beforeDeleteItems)
    }
    this.setState({currentImageList: newImageList});
  };

  async getImagesFromURL(urlList) {

    this.setState({loading:true})
    const promises = urlList.map((img) => FileAndImageSize(img.url, paramsGlr));
    const results = await Promise.allSettled(promises);
    const goodImage = results.filter(p => p.status === 'fulfilled').map(function (status) { return status.value});
    const badImage = results.filter(p => p.status === 'rejected').map(function (status) { return status.reason});
    let newImageList=[];
    newImageList = this.updateImageList(goodImage,[...this.state.currentImageList])        
    this.setState({
      currentImageList:newImageList, badImageList: badImage, loading:false})

    console.log(this.state.currentImageList);       
  }

  componentDidUpdate(prevProps, prevState){
    if ( this.state.currentImageList.length > 0 && prevState.innerWidth !== this.state.innerWidth) {
      let newImageList=[];

       newImageList = this.updateImageList(this.state.currentImageList,[]);
        this.setState({
              currentImageList:newImageList})
    }
  }

  updateDimensions = () => {
      if ((this.ref.current)&&(this.ref.current.clientWidth !== this.state.innerWidth)) {
        this.setState({ innerWidth: this.ref.current.clientWidth });
      }  
  };

  componentWillUnmount() {
     this.updateDimensions();
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);

  }

  render() {
  
    console.log('RENDER-APP');
    let badImageMessage = (
      <MemoBadImageMessage badImageList={this.state.badImageList} />
    );
    return (<>
    
      <div className="app-wrapper">
        <Header/>
        
          <div className="content" ref={this.ref} style={{ maxWidth: paramsGlr.widthRowMax, minWidth: paramsGlr.widthRowMin }}>
            WIDTH:{this.state.innerWidth}
            <h1 className="text">Галерея изображений</h1>
          <Route exact={true} path='/' render = {() =><> 
            <Uploader getURL={this.getImagesFromURL} arrExtnsFile={arrExtnsFile} />
            <p id="expDesc" tabIndex="-1">
              {badImageMessage}
            </p>

            {this.state.loading && <Preloader />}
            <Gallery
              imageList={this.state.currentImageList} loading={this.state.loading}
              imageListAfterdeleteImg={this.imageListAfterdeleteImg}
            /></>}  />
          <Route exact={true} path='/about' render = {() => <About />}  />
          <Route  exact={true} path='/contacts' render = {() => <Contacts />}  />
          
          </div>  
         <Footer/>
      </div>
   
      </>
    );
  }
}

export default App;
