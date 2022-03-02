const express = require("express");
// const validator = require("express-validator");
// const session = require("express-session");
const path = require("path");
// const uuid = require("uuid");
const cors = require("cors");
const dotenv = require("dotenv");
// const passport = require("passport");
// const mongoStore = require("connect-mongo");
// const messages = require("express-messages");
// const flash = require("connect-flash");
const { db } = require("./config/database");


const app = express();
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"static")));

dotenv.config({path : path.join(__dirname,"./config/config.env")});


db();

// app.use(session({
// 	secret : process.env.SECRET,
// 	resave:true,
// 	saveUninitialized:true,
// 	store:mongoStore.create({
// 		mongoUrl:process.env.MONGODB_URL_DEV,
// 		ttl:10*24*60*60
// 	})
// 	// cookie:{secure:true}
// }));

// app.use(flash());

// app.use((req,res,next) =>{
// 	res.locals.messages = messages(req,res);
// 	next();
// });

// app.use(validator({
// 	errorFormatter: (param, msg, value) => {
// 		var namespace = param.split("."),
// 			root = namespace.shift(),
// 			formParam = root;

// 		while(namespace.length){
// 			formParam += `[${namespace.shift()}]`;
// 		}
// 		return {
// 			param: formParam,
// 			msg,
// 			value
// 		};
// 	}
// }));



// require("./config/passport")(passport);
// app.use(passport.initialize());
// app.use(passport.session());


//import the routes to use
const clients = require("./clients/routes");
const admin = require("./admin/routes");
const customers = require("./customers/routes");
const error = require("./utils/routes");
const { pageNotFound } = require("./utils/errorHandling");


app.use("/",customers);
app.use("/client",clients);
app.use("/admin",admin);
app.use(error);
app.use(pageNotFound);

const PORT = 3015 ; 
app.listen(PORT,() =>{
	console.log(`server running on http://localhost:${PORT}`);
});