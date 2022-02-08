import React from 'react';
import './uploader.scss';
import PropTypes from 'prop-types';
import { CheckURL } from '../utils/utils';
import icoBtnLoad from './img/load.png';
import { withRouter } from 'react-router-dom';

class FormLoadImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputRef = React.createRef();
    this.state = {
      errorMsg: '',
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    let url = this.inputRef.current.value;
    CheckURL(url, this.props.arrExtnsFile)
      .then((data) => {
        if (data === 'img') {
          this.props.getURL([{ url }]);
        }

        if (data === 'json') {
          fetch(url)
            .then((res) => res.json())
            .then((images) => {
              this.props.getURL(images.images);
            })
            .catch(() => {
              this.setState({ errorMsg: 'Error loading file:' + url });
            });
        }

        this.setState({ errorMsg: '' });
      })

      .catch((error) => this.setState({ errorMsg: error }));
  }

  render() {
    return (
      <div className="uploader">
        <form onSubmit={this.handleSubmit}>
          <label id="expLabel" htmlFor="imgURL">
            URL:
          </label>
          <br />

          <input
            type="text"
            ref={this.inputRef}
            id="imgURL"
            aria-labelledby="expLabel expDesc"
            placeholder="*.json/ *.jpg/ *.jpeg/ *.png"
          />

          <button
            type="submit"
            className="submitButton"
            style={{ backgroundImage: `url(${icoBtnLoad})` }}
          />

          <div id="expDes">
            <span id="expDes_" tabIndex="-1">
              {this.state.errorMsg}
            </span>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(FormLoadImage);

FormLoadImage.propTypes = {
  getURL: PropTypes.func,
  arrExtnsFile: PropTypes.object,
};
