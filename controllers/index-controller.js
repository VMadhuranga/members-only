const homePageGet = (req, res) => {
  res.redirect("/");
};

const faqPageGet = (req, res) => {
  res.render("faq-view", {
    title: "FAQs",
  });
};

module.exports = {
  homePageGet,
  faqPageGet,
};
