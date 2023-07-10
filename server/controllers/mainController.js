
exports.homepage= (req, res) => {
    const locals = {
      title: "Homepage",
      description : "this is a nodejs powered user managment system"
    }
    res.render("index", locals);
  };