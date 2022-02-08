import React from 'react';
import './footer.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Footer = (props) => (
  <div className="footer">
    <div className="container-footer" style={{ minWidth: props.minWidth }}>
      <Link className="link-footer" to="/about">
        <span>GALLERY</span>
      </Link>
      <p className="text-footer">
        <span>Designed by</span>
      </p>
      <Link className="link-footer" to="/contacts">
        <span>Кошевая Е.А.</span>
      </Link>
    </div>
  </div>
);

const MemoFooter = React.memo(Footer);

export default MemoFooter;

Footer.propTypes = {
  minWidth: PropTypes.number,
};
