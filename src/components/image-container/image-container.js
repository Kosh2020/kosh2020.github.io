import React from 'react';

import './image-container.scss';

import PropTypes from 'prop-types';

import Preloader from '../preloader/preloader';

import Popup from '../popup/popup';

import useIntersectionObserver from '../use-intersection-observer';

export const  ImageContainer = (props) => {
 
 const ref = React.useRef();
 const [isVisible,setIsVisible] = React.useState(false);
 useIntersectionObserver({
    target:ref,
    onIntersect:([{ isIntersecting }], observerElement) =>{
      if (isIntersecting){
        setIsVisible(true);
        observerElement.unobserve(ref.current);
      }
    }
  }) 
  let item=props.item;
  return (<div>
     <div
        ref={ref}
        className="wrap_img"
        style={{ width: item.w_preview, height: item.h_preview }}
      >
      {isVisible && <><img
          alt={item.url}
          onClick={() =>
            props.handlePopup(item.src, item.i, item.width, item.height)
          }
          src={item.src}
          style={{ display: props.loading ? 'none' : 'block'}}
      />
      <div
          className='placeholder'
          style={{ display:  props.loading ? 'block' : 'none'}}
          alt={item.url}
          src='placeholder.jpg'
        /></>
     }
     </div>
    </div>)  }
 
ImageContainer.propTypes = {
  item: PropTypes.obj,
  handlePopup: PropTypes.func,
  loading: PropTypes.bool
};