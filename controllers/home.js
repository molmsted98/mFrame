const User = require('../models/User');
/**
 * GET /
 * Home page.
 */
exports.getUsers = (req, res) => {
  User.find({username: req.body.search}).lean().exec((err, users) => {
    console.log(req.body.search);
    console.log(users);
    res.render('home', {
      title: 'Home',
      "users": users
    });
  });
};
