# Recognize Floor Plan

Recognize Floor Plan is a Javascript library for detecting if an image is a floor plan or an image.


## Usage

```javascript
var isImageAnFloorPlan = require("./floorPlan")

// returns 'true/false or error'
isImageAnFloorPlan(img).then((data)=>{
    console.log(data);
}).catch((err)=> {
    console.log(err);
})
```

## Disclaimer

It's not getting 100% correct results but it's not far from it.
Play with the threshold to fine-tune the results. 

## License

[MIT](https://choosealicense.com/licenses/mit/)