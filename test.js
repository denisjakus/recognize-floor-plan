//const img =  __dirname + "/" +'demoImage1.jpeg'
//const img =  __dirname + "/" +'demoImage2.jpg'
const imgUrl =  __dirname + "/" +'demoImage3.jpg'



var isImageAnFloorPlan = require("./floorPlan")

isImageAnFloorPlan(imgUrl).then((data)=>{
    console.log(data);
}).catch((err)=> {
    console.log(err);
})
