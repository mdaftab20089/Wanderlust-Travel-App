// requiring the packages..
if(process.env.NODE_ENV!="production") {
  require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path =require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({ extended: true }));
let methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname,"/public")));

const engine=require("ejs-mate");
app.engine("ejs", engine);

const listingsRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const flash=require("connect-flash");
const session =require("express-session");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wanderlust');
}



main().
      then(()=>{
          console.log("Connected to DB");
      }).
    catch(err => console.log(err));


const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized: true,
  cookie: {
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly:true
  },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//     // home route..
// app.get("/", (req, res) => {
//   // prefer view name without leading slash or extension
//   res.render("HomePage/home");
// });



app.get("/demo",async (req,res)=>{
  let fakeUser=new User({
    email:"aftab@gmail.com",
    username:"aftabrahi"
  });
  let registeredUser= await User.register(fakeUser,"abcd123");
  res.send(registeredUser);
})

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

app.use("/listing",listingsRouter);
app.use("/",userRouter);
app.use("/listing/:id/review",reviewRouter);




// ---- central error handler (LAST) ----
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  const status = Number.isInteger(err?.statusCode) ? err.statusCode : 500;
  const msg = err?.message || "Something went wrong";

  if (res.headersSent) return next(err);
  res.render("error.ejs",{msg});
});


app.listen(8080,()=>{
    console.log("app is listening on 8080");
});



