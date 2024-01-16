class SiteController {
  index(req, res) {
    res.render("index");
  }

  notFound(req, res) {
    res.status(404).json("Error 404: Not Found");
  }

  getTime(req, res) {
    let { locale, options } = req.body;
    locale = locale ?? "vi-VN";
    options = options ?? {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };

    const date = new Date().toLocaleString(locale, options);

    res.json({ date, locale });
  }
}

module.exports = new SiteController();
