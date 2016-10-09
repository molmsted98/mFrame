const User = require('../models/User');
/**
 * GET /
 * Home page.
 */
exports.getUsers = (req, res) => {
  if (req.body.search)
  {
    User.find({username: new RegExp(req.body.search, "i")}).lean().exec((err, users) => {
      User.find().sort('-date').limit(5).exec(function(err, users2){
        res.render('home', {
          title: 'Home',
          "users": users,
          "users2": users2
        });
      });
    });
  }
  else
  {
    User.find().sort('-date').limit(5).exec(function(err, users2){
      res.render('home', {
        title: 'Home',
        "users2": users2
      });
    });
  }
};
