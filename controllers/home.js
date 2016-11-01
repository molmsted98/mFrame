const User = require('../models/User');
/**
 * GET /
 * Home page.
 */
exports.getUsers = (req, res) => {
    //Only try to search when there is a query in the search box
    if (req.body.search) {
        //Get users that contain search query and demo users.
        User.find({
            username: new RegExp(req.body.search, "i")
        }).lean().exec((err, users) => {
            User.find({
            username: new RegExp("demo", "i")
        }).exec(function(err, demoUsers) {
                res.render('home', {
                    title: 'Home',
                    "users": users,
                    "demoUsers": demoUsers
                });
            });
        });
    } else {
        //Get the demo users
        User.find({
            username: new RegExp("demo", "i")
        }).exec(function(err, demoUsers) {
            res.render('home', {
                title: 'Home',
                "demoUsers": demoUsers
            });
        });
    }
};
