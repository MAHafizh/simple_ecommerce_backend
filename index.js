import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import authRoute from "./routes/authRoute.js"
import db from "./config/Database.js";
import sequelizeStore from "connect-session-sequelize";
import Users from "./models/usermodel.js";
import Products from "./models/productmodel.js";
import Addresses from "./models/addressmodel.js";

dotenv.config()
const app = express();
const sessionStore = sequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

try {
    await db.authenticate();
    console.log("Database Connected...");
    await Users.sync();
    await Products.sync();
    await Addresses.sync();
  } catch (error) {
    console.error(error);
  }

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(userRoute);
app.use(productRoute);
app.use(authRoute);

store.sync();

app.listen(process.env.APP_PORT, ()=> {
    console.log(`Server Running at Port ${process.env.APP_PORT}`)
});
