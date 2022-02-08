class Image {
  constructor(img) {
    this.i = 0;

    this.row = 0;

    this.url = img.src;

    this.hPreview = 0;

    this.wPreview = 0;

    this._width = img.width;

    this._height = img.height;
  }

  get width() {
    return this._height / this._width < 2 / 3 ? (3 * this._height) / 2 : this._width;
  }

  get height() {
    return this._width / this._height < 2 / 3 ? (3 * this._width) / 2 : this._height;
  }

  wPreviewForHeight(height) {
    return (height * this._width) / this._height;
  }
}

class Gallery {
  constructor(listImages, innerWidth, sett) {
    this.listImages = [...listImages];

    this.heightRowMin = sett.heightRowMin;

    this.heightRowMax = sett.heightRowMax;

    this.widthRowMin = sett.widthRowMin;

    this.widthRowMax = sett.widthRowMax;

    this._innerWidth = innerWidth;
  }

  get lastRow() {
    return this.listImages.length > 0 ? this.listImages[this.listImages.length - 1].row : 0;
  }

  get lastIImg() {
    return this.listImages.length > 0 ? this.listImages[this.listImages.length - 1].i : 0;
  }

  get width() {
    return this._height / this._width < 2 / 3 ? (3 * this._height) / 2 : this._width;
  }

  get height() {
    return this._width / this._height < 2 / 3 ? (3 * this._width) / 2 : this._height;
  }

  get imagesOfLastRow() {
    return this.listImages.length > 0
      ? this.listImages.filter((img) => img.row === this.lastRow)
      : [];
  }

  get widthLastAllImgsForMinHeight() {
    return this.widthLastRowForHeight(this.heightRowMin);
  }

  get widthLastAllImgsForMaxHeight() {
    return this.widthLastRowForHeight(this.heightRowMax);
  }

  get widthRow() {
    let innerWidth = this._innerWidth;

    let res = 0;

    if (innerWidth < this.widthRowMin) {
      res = this.widthRowMin;
    }

    if ((innerWidth >= this.widthRowMin) & (innerWidth <= this.widthRowMax)) {
      res = innerWidth - 1;
    }

    if (innerWidth > this.widthRowMax) {
      res = this.widthRowMax;
    }

    return res;
  }

  widthLastRowForHeight(height_row) {
    let listImages = [...this.imagesOfLastRow];

    let height = height_row;

    let widthImages = 0;

    if (listImages.length > 0) {
      listImages.forEach((img) => {
        widthImages += (height * img.width) / img.height;
      });
    }

    return widthImages;
  }

  alignHeightImgsInRow(height) {
    if (this.listImages.length > 0) {
      this.listImages.forEach((img) => {
        if (img.row === this.lastRow) {
          img.h_preview = height;
          img.w_preview = (height * img.width) / img.height;
        }
      });
    }
  }

  stretchLastRow() {
    let ratio = this.widthRow / this.widthLastAllImgsForMinHeight;

    let fudge = 1;

    this.listImages.forEach((img) => {
      if (img.row === this.lastRow) {
        img.h_preview = this.heightRowMin * ratio * fudge;

        img.w_preview = ((this.heightRowMin * img.width) / img.height) * ratio * fudge;
      }
    });
  }
}

export const PreviewSize = (listImages, img, innerWidth, sett) => {
  let gllr = new Gallery(listImages, innerWidth, sett);

  let image = new Image(img);

  image.hPreview = gllr.heightRowMin;

  image.wPreview = image.wPreviewForHeight(image.hPreview);

  image.row = gllr.lastRow;

  image.i = gllr.lastIImg + 1;

  if (gllr.widthLastAllImgsForMinHeight + image.wPreview > gllr.widthRow) {
    gllr.stretchLastRow();

    image.row = image.row + 1;
  }

  gllr.listImages.push({
    i: image.i,

    src: image.url,

    name: 'wrap_img' + image.i,

    h_preview: image.hPreview,

    w_preview: image.wPreview,

    row: image.row,

    height: image.height,

    width: image.width,
  });

  gllr.alignHeightImgsInRow(image.hPreview);

  if (
    gllr.widthLastAllImgsForMinHeight <= gllr.widthRow &&
    gllr.widthLastAllImgsForMaxHeight > gllr.widthRow
  )
    gllr.stretchLastRow();

  return gllr.listImages;
};
