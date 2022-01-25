import React from 'react';

import './Gallery.scss';

import PropTypes from 'prop-types';

import {PreviewSize} from '../PreviewSize';

import {FileAndImageSize} from '../Utils';

import Preloader from '../preloader/Preloader';

import Popup from '../popup/Popup';



const Images = React.memo((props) => {

  let imageList_=props.imageList;


  if (imageList_.length===0) {return <div className="noImages">No images</div>}


  return imageList_.map((item,index)=>{

      return(

        <div key={index} className="wrap_img" style={{width: item.w_preview,  height: item.h_preview}}>

        <img  alt={item.url} onClick = {() => props.handlePopup(item.src, item.i, item.width, item.height, )} src={item.src}  />

        </div>

      );
  })

});


const BadImageMessage =  React.memo((props) =>{

  let badImageList=props.badImageList;

  let badImageMessage=[];

  if (badImageList.length>0) {

    badImageMessage=badImageList.map((e,index) => [e,<br key={index}/>]);

    badImageMessage.unshift(['Files were not uploaded: ',<br key='0'/>]); 

  }  

  return badImageMessage;

});


export default class Gallery extends React.PureComponent{

  constructor(props) {

    super(props);

    this.ref = React.createRef();
    
    this.state = {

        goodImageList:[],

        badImageList:[],

        innerWidth: 0,  

        loading: false,

        showModal: false,

        popImageUrl: "",

        popImageWidth: 0,

        popImageHeight: 0          

    }
  }

componentWillReceiveProps(nextProps){

  if (nextProps.imageList.length>0){
  
    let imgs=nextProps.imageList;

    let badImageList=[];

    this.setState({loading:true})

    imgs.forEach( img => {

      FileAndImageSize(img.url, nextProps.paramsGlr)

      .then( img => {

        this.setState({goodImageList:

        PreviewSize(this.state.goodImageList, img ,this.state.innerWidth,this.props.paramsGlr) })

        
      })

      .catch((err) => {

        badImageList=[...badImageList];

        badImageList.push(err);

        this.setState({badImageList:badImageList})
      })  

   
    })

    this.setState({loading:false})

   } 
  
}


updateDimensions = () => {

  if (this.ref.current) {

    this.setState({innerWidth: this.ref.current.clientWidth}); 

  }  

};


updateImageList(){

  let newImageList = [];

  let goodImageList = [...this.state.goodImageList];

  goodImageList.forEach((img) => {

    newImageList = PreviewSize(newImageList,img ,this.state.innerWidth,this.props.paramsGlr)

  })

 this.setState({goodImageList: newImageList}); 
}


componentDidUpdate(prevProps, prevState) { 

  if ((this.state.goodImageList.length>0) && ((prevState.innerWidth) !== (this.state.innerWidth))){

    this.updateImageList();

  }
}  


componentWillUnmount() {

  window.removeEventListener('resize', this.updateDimensions);

}


componentDidMount () {

 this.updateDimensions();

 window.addEventListener('resize', this.updateDimensions);

}


handlePopup = (url, numb, width, height) => {

  this.setState({

    showModal: !this.state.showModal,

    popImageUrl: url,

    popImageNumber: numb,

    popImageWidth: width,

    popImageHeight: height

  });

};


deleteImg = (i) => {

  this.setState({loading: true});

  const imageList  = [...this.state.goodImageList];

  let beforeDeleteItems = imageList.filter(item => item.i < i);

  const afterDeleteItems = imageList.filter(item => item.i > i);

  let newImageList1 = [];

  if (afterDeleteItems.length===0) 

    {newImageList1=beforeDeleteItems}

  else{

    afterDeleteItems.forEach((img) => {

    newImageList1 = PreviewSize(beforeDeleteItems ,img ,this.state.innerWidth, this.props.paramsGlr);

    beforeDeleteItems=[...newImageList1];

    });

  } 

  this.setState({goodImageList: newImageList1});

  this.setState({loading: false});

};


deletePopup = () => {

  this.deleteImg(this.state.popImageNumber);

  this.setState({

    showModal: !this.state.showModal,

    popImageUrl: '',

    popImageNumber: null,

  });

};


  render(){  

    let badImageMessage=<BadImageMessage badImageList={this.state.badImageList}/>;

    console.log("RENDER-GALLERY");

    return (

      <div className="gallery" style={{maxWidth: this.props.paramsGlr.widthRowMax}} ref={this.ref}>
     
        <span id="expDesc" tabIndex="-1">{this.state.errorMsg}<br/>{badImageMessage}</span>

        {this.state.loading && <Preloader/>}

        <Images imageList={this.state.goodImageList}  handlePopup={this.handlePopup} />

        {this.state.showModal ?

          <Popup

            popupImageUrl = {this.state.popImageUrl}

            closePopup = {this.handlePopup}

            deletePopup = {this.deletePopup}

            popImageWidth = {this.state.popImageWidth}

            popImageHeight = {this.state.popImageHeight}

          />

          : null}

      </div>
    );
  }  
  
}

Images.propTypes = {

  imageList : PropTypes.array,

  handlePopup : PropTypes.func

}

Gallery.propTypes = {

  url : PropTypes.array,

  paramsGlr : PropTypes.object

}