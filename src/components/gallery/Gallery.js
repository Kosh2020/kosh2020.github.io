import React from 'react';
import './gallery.scss';
import PropTypes from 'prop-types';
import { ImageContainer } from '../image-container/image-container';
import Popup from '../popup/popup';
import { withRouter } from 'react-router-dom';

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
    this.props.deleteImg(this.state.popImageNumber);
    this.setState({
      showModal: !this.state.showModal,
      popImageUrl: '',
      popImageNumber: null,
    });
  };

  render() {
    return (
      <div className="gallery">
        {this.props.imageList.length ? (
          this.props.imageList.map((item, index) => (
            <ImageContainer
              key={index}
              item={item}
              handlePopup={this.handlePopup}
              loading={this.props.loading}
            />
          ))
        ) : (
          <div className="noImages">No images</div>
        )}

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
  deleteImg: PropTypes.func,
  paramsGlr: PropTypes.object,
  loading: PropTypes.bool,
};
