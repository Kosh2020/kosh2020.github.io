import React, { PureComponent } from 'react';
import './popup.scss';
import PropTypes from 'prop-types';

class Popup extends PureComponent {
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

    if (widthPopup > this.state.innerWidth * 0.9) {
      widthPopup = this.state.innerWidth * 0.9;
      heightPopup = widthPopup * (this.props.popImageHeight / this.props.popImageWidth);
    }

    if (heightPopup > this.state.innerHeight * 0.9) {
      heightPopup = this.state.innerHeight * 0.9;
      widthPopup = heightPopup * (this.props.popImageWidth / this.props.popImageHeight);
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
    console.log('RENDER-POPUP');

    let styleImg = this.sizePopUp();
    return (
      <div className="popupParent" ref={this.ref}>
        <div className="popupImage" style={{ width: styleImg.width, height: styleImg.height }}>
          <button className="imageClosingButton" onClick={this.props.closePopup}>
            X
          </button>

          <button className="imageDeletingButton" onClick={this.props.deletePopup}>
            Delete
          </button>

          <img src={this.props.popupImageUrl} alt="preloader"></img>
        </div>
      </div>
    );
  }
}

Popup.propTypes = {
  popupImageUrl: PropTypes.string,
  closePopup: PropTypes.func,
  deletePopup: PropTypes.func,
  popImageWidth: PropTypes.number,
  popImageHeight: PropTypes.number,
};

export default Popup;
