const express=require("express")
const app=express();
const session =require("express-session");
const flash=require("connect-flash")


app.use(session({
    secret: "mysecretkey",       // required: session ko sign karne ke liye key
    resave: false,               // agar session change nahi hua to save mat karo
    saveUninitialized: true, 
    cookie: {
    expires:Date.now()+1000*60*60*24*3,
    maxAge:1000*60*24*3,
    }
}));
app.use(flash());

const port=3000;
app.get("/",(req,res)=>{
    res.send("this is root");

})

app.get("/request",(req,res)=>{
    if(req.session.count) {
        req.session.count++;
    } else {
        req.session.count=1;
    }
    res.send(`you send request at ${req.session.count} times`);
})

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;   // Extract name from query string (defaults to "anonymous")
  req.session.name = name;    
  if(name==="anonymous") {
     req.flash("error","user not registered");
  } else {
    req.flash("success", "user registered successfully!");    // Set a flash message
  }      
  res.redirect("/hello");                   // Redirect user to /hello route
});

app.get("/hello",(req,res)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.render("page.ejs",{name:req.session.name});
})


app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})