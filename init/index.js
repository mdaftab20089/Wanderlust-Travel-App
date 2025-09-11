const mongoose=require("mongoose");
const InitData=require("./data.js");
const Listing=require("../Models/listing.js");

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

main().
      then(()=>{
          console.log("Connected to DB");
      }).
    catch(err => console.log(err));

const initDB=async ()=>{
    await Listing.deleteMany({});
    InitData.data=InitData.data.map((obj)=>({...obj,owner:'68bf36bbc7758c2f81f3f9d2'}));
    await Listing.insertMany(InitData.data);
    console.log("data insertion successful");
}    

initDB();