import React from 'react';

import './gallery.scss';

import PropTypes from 'prop-types';

//import { PreviewSize } from '../preview-size';

import { ImageContainer }   from '../image-container/image-container';

import { FileAndImageSize } from '../utils';

import Preloader from '../preloader/preloader';

import Popup from '../popup/popup';



import {withRouter} from 'react-router-dom';

/*class Image extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      isVisible: false,
    }
 }
  componentDidMount(){
    useIntersectionObserver({
      target:this.ref,
      onIntersect:([{ isIntersecting }], observerElement) =>{
        if (isIntersecting){
          this.state.setState({isVisible:true});
          observerElement.unobserve(this.ref.current);
        }
      }
    })
  } 

  render() {  
  
/*const Image=(props)=> {
  const item=props;
  const ref = React.createRef();
  const [isVisible,setIsVisible] = React.useState(false);
  useIntersectionObserver({
    target:ref,
    onIntersect:([{ isIntersecting }], observerElement) =>{
      if (isIntersecting){
        setIsVisible(true);
        observerElement.unobserve(ref.current);
      }
    }
  })*/

  //const isVisible=true;
/*  let i=this.props;
  return (
      {i}
    );
}
}

const Images = (props) => {
  let imageList_ = props.imageList;

  if ((imageList_.length === 0)&&(!(props.loading))) {
    return <div className="noImages">No images</div>;
  }

  return imageList_.map((item,index) =>{<ImageContainer key={index} > it={item}  loading={props.loading}</ImageContainer>});

};*/

//const MemoImage = React.memo(Images);

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

class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      goodImageList: [],
      badImageList: [],
      loading: false,

      showModal: false,

      popImageUrl: '',
      popImageWidth: 0,
      popImageHeight: 0,
    };
  }

/*
  updateImageList(ImgListWithoutPrSize,imgListForAdd) {

    let newImageList = [...imgListForAdd]

    ImgListWithoutPrSize.forEach((img) => {
      newImageList = PreviewSize(
        newImageList,
        img,
        this.state.innerWidth,
        this.props.paramsGlr
      );
    });
    return newImageList;
  }

async componentDidUpdate(prevProps, prevState) {

    if ((this.props.imageList.length > 0)&&(prevProps !== this.props))
    {
      let imgs = this.props.imageList;

      let badImageList = [];

      this.setState({loading:true})

      const promises = imgs.map((img) => FileAndImageSize(img.url, this.props.paramsGlr));

      const results = await Promise.allSettled(promises);

      const goodImage = results.filter(p => p.status === 'fulfilled').map(function (status) { return status.value});

      const badImage = results.filter(p => p.status === 'rejected').map(function (status) { return status.reason});

      let newImageList=[];

      newImageList = this.updateImageList(goodImage,[...this.state.goodImageList])
         
      this.setState({
              goodImageList:newImageList, baddImageList:badImage, loading:false})

      console.log(this.state.goodImageList);

    }

    else{

      if (
        this.state.goodImageList.length > 0 &&
        prevState.innerWidth !== this.state.innerWidth
      ) {
      let newImageList=[];

       newImageList = this.updateImageList(this.state.goodImageList,[]);
        this.setState({
              goodImageList:newImageList})
      }
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

  
  shouldComponentUpdate(nextProps,nextState){
    if (((this.state.innerWidth)!==(nextState.innerWidth))&&(nextState.goodImageList.length===0)) {
      return false
   }
   else return true   
  }
*/

  handlePopup = (url, numb, width, height) => {
    this.setState({
      showModal: !this.state.showModal,

      popImageUrl: url,

      popImageNumber: numb,

      popImageWidth: width,

      popImageHeight: height,
    });
  };
/*
  imageListAfterdeleteImg = (i) => {

    const imageList = [...this.state.goodImageList];

    let beforeDeleteItems = imageList.filter((item) => item.i < i);

    const afterDeleteItems = imageList.filter((item) => item.i > i);

    let newImageList = [];

    if (afterDeleteItems.length === 0) {
      newImageList = beforeDeleteItems;
    } else {
        newImageList = this.updateImageList(afterDeleteItems,beforeDeleteItems)


    }

    return newImageList;
  };*/

  deletePopup = () => {

    this.setState({ loading: true });

    let newImageList = this.props.imageListAfterdeleteImg(this.state.popImageNumber);

    this.setState({


      showModal: !this.state.showModal,

      popImageUrl: '',

      popImageNumber: null,

    //  goodImageList: newImageList,

      loading: false

    });
  };

  render() {
    let badImageMessage = (
      <MemoBadImageMessage badImageList={this.state.badImageList} />
    );

    console.log('RENDER-GALLERY');
    let im=this.props.imageList.map((item,index) =><ImageContainer key={index}  item={item} handlePopup={this.handlePopup}  loading={this.props.loading} />)
    return (
      <div
        className="gallery"
        ref={this.ref}>
        {this.state.loading && <Preloader />}
        {im}
    

        {this.state.showModal ? (
          <Popup
            popupImageUrl={this.state.popImageUrl}
            closePopup={this.handlePopup}
            deletePopup={this.deletePopup}
            popImageWidth={this.state.popImageWidth}
            popImageHeight={this.state.popImageHeight}
          />
        ) : null}
      </div>
    );
  }
}

export default withRouter(Gallery);

Gallery.propTypes = {
  imageList: PropTypes.array,
  imageListAfterdeleteImg: PropTypes.func,
  paramsGlr: PropTypes.object,
  loading: PropTypes.bool
};
