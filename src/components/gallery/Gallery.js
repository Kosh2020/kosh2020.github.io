import React from 'react';
import './gallery.scss';
import PropTypes from 'prop-types';
import { ImageContainer }   from '../image-container/image-container';
import { FileAndImageSize } from '../utils';
import Popup from '../popup/popup';

import {withRouter} from 'react-router-dom';

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

    this.state = {
      goodImageList: [],
      badImageList: [],
      showModal: false,
      popImageUrl: '',
      popImageWidth: 0,
      popImageHeight: 0,
    };
  }

  handlePopup = (url, numb, width, height) => {
    this.setState({
      showModal: !this.state.showModal,
      popImageUrl: url,
      popImageNumber: numb,
      popImageWidth: width,
      popImageHeight: height,
    });
  };

  deletePopup = () => {
    this.setState({ loading: true });
    let newImageList = this.props.imageListAfterdeleteImg(this.state.popImageNumber);
    this.setState({
      showModal: !this.state.showModal,
      popImageUrl: '',
      popImageNumber: null,

    });
  };

  render() {
    let badImageMessage = (
      <MemoBadImageMessage badImageList={this.state.badImageList} />
    );

    console.log('RENDER-GALLERY');
    let images=this.props.imageList.map((item,index) =><ImageContainer key={index}  item={item} handlePopup={this.handlePopup}  loading={this.props.loading} />)
    return (
      <div className="gallery" >
        {images}
    
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
