import React from 'react';
import './uploader.scss';
import PropTypes from 'prop-types';
import icoBtnLoad from './img/load.png';
import { withRouter } from 'react-router-dom';

function GetFileExtension(filename) {
  return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
}

const CheckExt = (url, extnsns) =>
  new Promise((resolve, reject) => {
    if (url) {
      let extFile = GetFileExtension(url);

      const arrExtns = Object.keys(extnsns);

      let noCorrectExt = true;

      for (const ext of arrExtns) {
        if (extnsns[ext].includes(extFile.toLowerCase())) {
          resolve(ext);

          noCorrectExt = false;
        }
      }

      if (noCorrectExt) {
        reject('Invalid file type  ( enter json, jpg, jpeg or png file )');
      }
    } else {
      reject('Check URL, image is not found');
    }
  });

const ReadLocalJSONFile = (file) =>
   new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = res => {
      resolve(JSON.parse(res.target.result).galleryImages);
    };
    reader.onerror = err => {reject(file.name + '  (loading error)');};

    reader.readAsText(file);
  });


class FormLoadImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.inputURLRef = React.createRef();
    this.inputFileRef = React.createRef();
    this.state = {
      errorMsg: '',
      typeFile:'INTERNET'
    };
  }

async GetArraySrc(src, file='', typeFile='INTERNET') {
  let typeFl;

  await CheckExt(src, this.props.arrExtnsFile)
  .then((data) => {typeFl=data})
  .catch((error) => this.setState({ errorMsg: error }));

  this.setState({ errorMsg: '' });
  switch(typeFl){
    case 'img': {
      this.props.getURL([{ url:src}], typeFile, file );
      break;}
    case 'json': {
      if (typeFile === 'INTERNET')  {
        fetch(src)
        .then((res) => res.json())
        .then((images) => { 
          images.galleryImages &&
          this.props.getURL(images.galleryImages, typeFile);
        })
        .catch(() => {
          this.setState({ errorMsg: 'Error loading file:' + src });
        });
      } 
      if (typeFile === 'LOCAL') { 
        await ReadLocalJSONFile(file)
        .then((data) => this.props.getURL(data, typeFile))
        .catch((error) => {this.setState({ errorMsg: error });})
      }                  
    } 
    default: break 
  } 
  
};

handleFileUpload(event) {
  if (this.inputFileRef.current.files.length>0) {
    let file = this.inputFileRef.current.files[0];  
    this.inputURLRef.current.value = this.inputFileRef.current.files[0].name;
    this.GetArraySrc(file.name, file, "LOCAL");
    this.inputFileRef.current.value='';
  }   
}  

handleSubmit(event) {
  event.preventDefault();  
  let file = this.inputURLRef.current.value; 

  if (file==="") { 
    this.inputFileRef.current.click();
  }
  else{
    if (!(/(http(s?)):\/\//i.test(file))) {this.setState({ errorMsg: 'Error: '+file+' is not a valid URL' })}
    else this.GetArraySrc(file, '', "INTERNET" );
  }
}

  render() {
    return (
      <div className="content-uploader">
        <form className="uploader-form" onSubmit={this.handleSubmit}>

          <label className="uploader-label" htmlFor="imgURL">
            URL:
          </label>

          <br />  

          <input
            type="text"
            ref={this.inputURLRef}
            className="uploader-input"
            aria-labelledby="expLabel content-errormsg"
            placeholder="*.json/ *.jpg/ *.jpeg/ *.png"
          />

          <input
            type="file"
            ref={this.inputFileRef}
            style={{ display:"none" }}
            onChange={this.handleFileUpload}
            aria-labelledby="expLabel content-errormsg"
          />

          <button
            type="submit"
            className="uploader-button"
            style={{ backgroundImage: `url(${icoBtnLoad})` }}
          />

            
        </form>
        <p className="content-errormsg" tabIndex="-1">
          {this.state.errorMsg}
        </p>
      </div>
    );
  }
}

export default withRouter(FormLoadImage);

FormLoadImage.propTypes = {
  getURL: PropTypes.func,
  arrExtnsFile: PropTypes.object,
};
