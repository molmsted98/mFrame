const User = require('../models/User');
/**
 * GET /
 * Home page.
 */
exports.getUsers = (req, res) => {
  User.find().lean().exec((err, users) => {
    console.log(users);
    res.render('home', {
      title: 'Home',
      "users": users
    });
  });
};
