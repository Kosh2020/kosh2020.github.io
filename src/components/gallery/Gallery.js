import React, { PureComponent } from 'react';
import './gallery.scss';
import placeholder from './../../img/placeholder.jpg';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { PreviewSize } from './../../components/utils/preview-size';

const lockScroll = () => {
   // document.body.dataset.scrollLock = 'true';
   // document.body.style.overflow = 'hidden';
    //document.body.style.paddingRight = 'var(--scrollbar-compensation)';

   /* if (isiOS) {
      scrollOffset.current = window.pageYOffset;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollOffset.current}px`;
      document.body.style.width = '100%';
    }*/
}

const unlockScroll = () => {
   // document.body.style.overflow = '';
   // document.body.style.paddingRight = '';
 //document.body.dataset.scrollLock = 'false';
   /* if (isiOS) {
      document.body.style.position = '';
      document.body.style.top = ``;
      document.body.style.width = '';
      window.scrollTo(0, scrollOffset.current);
    }*/
  //  delete document.body.dataset.scrollLock;
};

class PopupView extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      innerHeight: 0,
      innerWidth: 0,
    };
  }

  sizePopUp = () => {
    let widthPopup = this.props.popImageWidth;
    let heightPopup = this.props.popImageHeight;

    if (widthPopup > this.state.innerWidth * 0.7) {
      widthPopup = this.state.innerWidth * 0.7;
      heightPopup = widthPopup * (this.props.popImageHeight / this.props.popImageWidth);
    }

    if (heightPopup > this.state.innerHeight * 0.7) {
      heightPopup = this.state.innerHeight * 0.7;
      widthPopup = heightPopup * (this.props.popImageWidth / this.props.popImageHeight)-2;
    }

    return { width: widthPopup, height: heightPopup };
  };

  componentDidMount() {
    if (this.ref.current) {
      this.setState({ innerWidth: this.ref.current.clientWidth });
      this.setState({ innerHeight: this.ref.current.clientHeight });
    }
  }

  render() {
    let styleImg = this.sizePopUp();
    return (
      <div className="popup-parent popup-parent-view" ref={this.ref} >
        <div className="popup-view align-center"  style={{ width: styleImg.width, height: styleImg.height+5 }}>
          <div className="popup-view-close-icon gallery-icon">
            <a href="#" className="popup-view-link gallery-link" onClick={() => this.props.hidePopupView()} >
              <i className="ti-close"></i>
            </a>
          </div>
          <img className="popup-view-image" src={this.props.popupImageUrl} alt="preloader"></img>
        </div>
      </div>
    );
  }
};

const ImageContainer = (props) => {
  const ref = React.useRef();
  const [isVisible, setIsVisible] = React.useState(false);
  useIntersectionObserver({
    target: ref,
    onIntersect: ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        setIsVisible(true);
        observerElement.unobserve(ref.current);
      }
    },
  });
  let item = props.item;
  return (
    <>
      <div ref={ref} className="wrap-img" style={{ width: item.w_preview, height: item.h_preview }}>
        {isVisible && (
          <>
            <div className="wrap-img-for-popup-view" onClick={() => props.displayPopupView(item.src, item.i, item.width, item.height)} ></div>    
            <img className="wrap-img-img img"
              alt={item.url}
              src={item.src}
              style={{ display: props.loading ? 'none' : 'block' }}
            />
            <div className="wrap-img-delete-icon gallery-icon">
              <a href="#" className="wrap-img-icon-link gallery-link" onClick={() => props.displayPopupDelete(item.i)}>
                <i className="ti-trash"></i>
              </a>
            </div>
            <div
              className="gallery-placeholder img"
              style={{ display: props.loading ? 'block' : 'none' }}
              alt={item.url}
              src={placeholder}
            />
          </>
        )}
      </div>
    </>
  );
};

const BadImageMessage = (props) => {
  let badImageList = props.badImageList;
  let badImageMessage = [];

  if (badImageList.length > 0) {
    badImageMessage = badImageList.map((e, index) => [e, <br key={index} />]);
    badImageMessage.unshift(['Files were not uploaded: ', <br key="0" />]);
  }
  return (<div className="content-errormsg gallery-errormsg" tabIndex="-1"> {badImageMessage}</div>);
}

const MemoBadImageMessage = React.memo(BadImageMessage);


const useIntersectionObserver = ({ target, onIntersect, threshold = 0.1, rootMargin = '0px' }) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin,
      threshold,
    });

    const current = target.current;
    observer.observe(current);
    return () => {
      observer.unobserve(current);
    };
  });
};

const FileAndImageSize = (url, params) => {
  return new Promise((resolve, reject) => {
    let size;
    fetch(url)
      .then((response) => {
        size = Number(response.headers.get('content-length'));
        if (Number(size) > params.minimumFileSize && Number(size) < params.maximumFileSize) {
          const img = new Image();

          img.crossOrigin = 'Anonymous';

          img.addEventListener('load', () => {
            if (
              img.width > params.widthRowMin &&
              img.width < params.sizeImgMax &&
              img.height > params.heightRowMin &&
              img.height < params.sizeImgMax
            ) {
              resolve(img);
            } else reject(url + '  (incorrect image size)');
          });

          img.src = url;

          img.addEventListener('error', () => {
            reject(url + '  (loading error)');
          });
        } else reject(url + '  (incorrect file size)');
      })

      .catch(() => reject(url + '  (loading error)'));
  });
};

const ReadLocalImgFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = res => {
      resolve(res.target.result);
    };
    reader.onerror = err => reject(err);

    reader.readAsDataURL(file);
  });
}

const FileAndImageSizeByFile = (file,url, params) => {
return new Promise((resolve, reject) => { 
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.addEventListener('load', () => {
      if (
        img.width > params.widthRowMin &&
        img.width < params.sizeImgMax &&
        img.height > params.heightRowMin &&
        img.height < params.sizeImgMax
      ) {
          resolve(img);
        } else reject(file.name + '  (incorrect image size)');
    });

    img.src = url;

    img.addEventListener('error', () => {
      reject(file.name + '  (loading error)');
    });
       
      })
}

const getGoodImgAndBadImg = async(urlList) => {
    const promises = urlList.map((img) => FileAndImageSize(img.url, this.props.paramsGlr));
    const results = await Promise.allSettled(promises);
    const goodImage = results
      .filter((p) => p.status === 'fulfilled')
      .map(function (status) {

        return status.value;
      });
    const badImage = results
      .filter((p) => p.status === 'rejected')
      .map(function (status) {
        return status.reason;
      });
    return{goodImage:goodImage, badImage:badImage} 
 }

const updateImageList = (ImgListWithoutPrSize, imgListForAdd, innerWidth, paramsGlr) => {
  let newImageList = [...imgListForAdd];
  ImgListWithoutPrSize.forEach((img) => {
    newImageList = PreviewSize(newImageList, img, innerWidth, paramsGlr);
  });
  return newImageList;
}
const PopupDelete = (props) => {
  return (
    <div className="popup-parent " >            
      <div className="popup-delete align-center" >            
        <div className="popup-delete-close-icon gallery-icon">
          <a href="#" className="popup-delete-link gallery-link " onClick={() => props.hidePopupDelete()}>
            <i className="ti-close"></i>
          </a>
        </div>
        <span className="popup-delete-text">Подтвердите удаление изображения?</span> 
        <button className="popup-button popup-button-delete" onClick= {() => props.deleteImage(props.numb)} >Удалить</button> 
      </div>  
    </div>
  );

}
class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      paramsGlr:[],
      urlList:[],
      currentImageList: [],
      innerWidth: 0,
      innerHeight: 0,
      loading: false,
      goodImageList: [],
      badImageList: [],
      showModalForDelete: false,
      showModal: false,
      popImageUrl: '',
      popImageNumber: '',
      popImageWidth: 0,
      popImageHeight: 0,
      scrollY:0
    };
  }

  displayPopupView = (url, numb, width, height) => {
    let scroll= window.scrollY;
    this.props.refWrapp.current.style.position = 'fixed';
    this.props.refWrapp.current.style.top = `-${scroll}px`;
   // lockScroll();
    this.setState({
      showModal: !this.state.showModal,
      popImageNumber: numb,
      popImageUrl: url,
      popImageWidth: width,
      popImageHeight: height,
      scrollY:scroll,
    });
  };

  hidePopupView = () => {
  
   this.props.refWrapp.current.style.position = 'relative';
   this.props.refWrapp.current.style.top = '';
   window.scrollTo(0, this.state.scrollY);
   //this.props.refWrapp.current.style.top = `-${this.state.scrollY}px`;
    this.setState({
      showModal: !this.state.showModal,
    });
  };  
 
  displayPopupDelete = (numb) => {
    let scroll= window.scrollY;
    this.props.refWrapp.current.style.position = 'fixed';
    this.props.refWrapp.current.style.top = `-${scroll}px`;
    //lockScroll();
    this.setState({
      showModalForDelete: !this.state.showModalForDelete,
      popImageNumber: numb
    });
  };

  hidePopupDelete = () => {
    this.props.refWrapp.current.style.position = 'relative';
    this.props.refWrapp.current.style.top = '';
//lockScroll();
   window.scrollTo(0, this.state.scrollY);
 
    unlockScroll();
    this.setState({
      showModalForDelete: !this.state.showModalForDelete,
    })
  };

  deleteImage = (i) => {
    this.setState({
      showModalForDelete: !this.state.showModalForDelete
    }) 
    const imageList = [...this.state.currentImageList];
    let beforeDeleteItems = imageList.filter((item) => item.i < i);
    const afterDeleteItems = imageList.filter((item) => item.i > i);
    let newImageList = [];
    if (afterDeleteItems.length === 0) {
      newImageList = beforeDeleteItems;
    } else {
      newImageList = updateImageList(afterDeleteItems, beforeDeleteItems,this.state.innerWidth, this.state.paramsGlr);
    }
    this.setState({ currentImageList: newImageList });
  };

  async getImagesFromURL(urlList, typeFile, file ) {
    this.setState({ urlList:urlList,file:file });
  }


  async componentWillReceiveProps(newProps){
    const urlList=[...newProps.urlList];
    const file=newProps.file;
    this.setState({ loading: true,
                    badImageList: [],
                    paramsGlr:this.props.paramsGlr });
    let goodImage=[];
    let badImage=[];
    if (file){
      let url;
      await ReadLocalImgFile(file)
      .then((data) => url=data)
      .catch((error) => {badImage=[error]})

      await FileAndImageSizeByFile(file,url, this.props.paramsGlr)
      .then((data) => {goodImage=[data]})
      .catch((error) => {badImage=[error]})
    }
    else{
      await getGoodImgAndBadImg(urlList)
      .then((data) => {goodImage = data})
      .catch((error) => {badImage=[error]})
      
      const promises = urlList.map((img) => FileAndImageSize(img.url, this.props.paramsGlr));
      const results = await Promise.allSettled(promises);
      goodImage = results
        .filter((p) => p.status === 'fulfilled')
        .map(function (status) {
          return status.value;
        });
      badImage = results
        .filter((p) => p.status === 'rejected')
        .map(function (status) {
          return status.reason;
        });

    }
 
    let newImageList = [];
    newImageList = updateImageList(goodImage, [...this.state.currentImageList], this.state.innerWidth, this.state.paramsGlr);
    this.setState({
      currentImageList: newImageList,
      badImageList: badImage,
      loading: false,
    });
  }

  updateDimensions = () => {
    if (this.ref.current && this.ref.current.clientWidth !== this.state.innerWidth) {
      this.setState({ innerWidth: this.ref.current.clientWidth,
                      innerHeight: this.ref.current.clientHeight });
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
    return (
      <div className="gallery" ref={this.ref}>
        <MemoBadImageMessage badImageList={this.state.badImageList} />
        {this.state.currentImageList.length ? (
          this.state.currentImageList.map((item, index) => (
            <ImageContainer
              key={index}
              item={item}
              displayPopupView={this.displayPopupView}
              displayPopupDelete={this.displayPopupDelete}
              loading={this.props.loading}
            />
          ))
        ) : (
          <div className="align-center">No images</div>
        )}

        {this.state.showModal ? (
          <PopupView
            popupImageUrl={this.state.popImageUrl}
            hidePopupView={this.hidePopupView}
            popImageWidth={this.state.popImageWidth}
            popImageHeight={this.state.popImageHeight}
          />
        ) : null}
        {this.state.showModalForDelete ? (
          <PopupDelete
            numb={this.state.popImageNumber}
            deleteImage={this.deleteImage}
            hidePopupDelete={this.hidePopupDelete}
            innerWidth={this.props.innerWidth}
            innerHeight={this.props.innerHeight}
          />
        ) : null}
       
      </div>

    );
  }
}

export default withRouter(Gallery);

Gallery.propTypes = {
  urlList: PropTypes.array,
  file: PropTypes.string,
  paramsGlr: PropTypes.object,
};
