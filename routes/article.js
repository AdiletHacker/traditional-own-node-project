const express = require("express");
const Article = require("../models/article");
const router = express.Router();


router.get("/", async (req, res) => {
    const articles = await Article.find().sort({ createdAt: "desc" });
    res.render("articles/index", { articles: articles });
});

router.get("/new", async (req, res) => {
    res.render("articles/new", { article: new Article() });
});

router.get("/edit/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    res.render("articles/edit", { article: article });
});

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article === null) res.redirect("/");
    res.render("articles/show", { article: article });
});

router.post("/", async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect("new"));

router.put("/:slug", async (req, res) => {
    let article = await Article.findOneAndUpdate({ slug: req.params.slug },
        { title: req.body.title, description: req.body.description, markdown: req.body.markdown },
        { new: true, upsert: true });
    try {
        res.redirect(`/articles/${article.slug}`);
    } catch {
        res.render(`articles/new`, { article: article });
    }
});

router.delete("/:slug", async (req, res) => {
    await Article.findOneAndDelete({ slug: req.params.slug });
    res.redirect("/articles");
});

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch {
            res.render(`articles/${path}`, { article: article });
        }
    }
}




module.exports = router;















