require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Article = require("./models/article");
const articleRouter = require("./routes/article");
const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Database!"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use("/articles", articleRouter);


app.get("/", async (req, res) => {
    const articles = await Article.find().sort({ createdAt: "desc" });
    res.render("articles/index", { articles: articles });
});



app.listen(process.env.PORT || 3000);














