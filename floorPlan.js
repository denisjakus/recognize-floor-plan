
const getPixels = require("get-pixels");
const threshold = 0.033;

function createPixelArray(imgData, pixelCount, quality) {

  const pixels = imgData;

  const pixelArray = [];

  for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {

    offset = i * 4;

    r = pixels[offset + 0];

    g = pixels[offset + 1];

    b = pixels[offset + 2];

    a = pixels[offset + 3];

    pixelArray.push([r, g, b]);

  }

  return pixelArray;

}
  

function loadImg(img) {

  return new Promise((resolve, reject) => {

    getPixels(img, function (err, data) {

      if (err) {

        reject(err)

      } else {

        resolve(data);

      }

    })

  });

}
  

const getPixelArray = (imgDataUrl) => {

  return new Promise((resolve, reject) => {

    loadImg(imgDataUrl).then((imgData) => {

      const pixelCount = imgData.shape[0] * imgData.shape[1];

      const originalY = imgData.shape[1];

      const calcQuality = Math.floor(originalY / 1080);

      const quality = calcQuality < 1 ? 1 : calcQuality

      console.log(`Quality: ${quality}`);

      const pixelArray = createPixelArray(imgData.data, pixelCount, quality * 5);

      resolve({ pixelArray, pixelCount, imgData });

    });

  });

};

const isLight = (pixel) => {

  const r = pixel[0];

  const g = pixel[1];

  const b = pixel[2];

  return (r > 199 && g > 199 & b > 199);

};

  

const getPercentLight = ({ pixelArray }) => {

  return new Promise((resolve, reject) => {

    const count = pixelArray.filter(p => isLight(p)).length;

    const percent = 100 * count / pixelArray.length;

    resolve(percent);

  });

};


const pVal = (c) => {

  const gr = 10;

  return Math.round(c / gr) * gr;

};

  

const colorHash = (pixel) => {

  const r = pixel[0];

  const g = pixel[1];

  const b = pixel[2];

  return `${pVal(r)}.${pVal(g)}.${pVal(b)}`;

};

  

const getNumColors = ({ pixelArray, pixelCount, imgData }) => {

  return new Promise((resolve, reject) => {

    const colors = new Set(pixelArray.map(p => colorHash(p)));

    resolve(colors.size);

  });

};
  

  

const calculateSaturation = (pixel) => {

  let r = pixel[0];

  let g = pixel[1];

  let b = pixel[2];

  

  // Make r, g, and b fractions of 1

  r /= 255;

  g /= 255;

  b /= 255;

  

  // Find greatest and smallest channel values

  const cmin = Math.min(r, g, b);

  const cmax = Math.max(r, g, b);

  const delta = cmax - cmin;

  let s = 0;

  let l = 0;

  

  // Calculate lightness

  l = (cmax + cmin) / 2;

  

  // Calculate saturation

  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  

  return (s);

};

  

const getSaturation = ({ pixelArray, pixelCount }) => {

  return new Promise((resolve, reject) => {

    let sum = pixelArray.reduce((total, pixel) => total + calculateSaturation(pixel), 0);

    const checkValue = sum / pixelCount;

    resolve(checkValue);

  });

};

  

const isImageAnFloorPlan = (imgDataUrl) => {

  return new Promise((accept, reject) => {

    getPixelArray(imgDataUrl).then(({ pixelArray, pixelCount, imgData }) => {

          getSaturation({ pixelArray, pixelCount }).then((saturationValue) => {

            console.log("saturation: " + saturationValue);

            if(saturationValue < threshold){

              getNumColors({ pixelArray, pixelCount, imgData }).then(numColors => {

                if (numColors < 1000){

                  accept(true)

                } else { 

                  accept(false);

                }

              });

            } else {

              accept(false);

            }

          });

    });

  });

};

  

module.exports = isImageAnFloorPlan;


