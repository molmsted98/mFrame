const User = require('../models/User');
/**
 * GET /
 * Home page.
 */
exports.getUsers = (req, res) => {
    //Only try to search when there is a query in the search box
    if (req.body.search) {
        //Get users that contain search query and recent users.
        User.find({
            username: new RegExp(req.body.search, "i")
        }).lean().exec((err, users) => {
            User.find().sort('-date').limit(5).exec(function(err, users2) {
                res.render('home', {
                    title: 'Home',
                    "users": users,
                    "users2": users2
                });
            });
        });
    } else {
        //Only get recent users because nothing in search box
        User.find().exec(function(err, users2) {
            fusers = [];
            var ind = 0;
            console.log(fusers)
            for (i = users2.length - 1; i > users2.length - 6 && i > 0; i--) {
                fusers[ind] = users2[i];
                ind++;
            }
            console.log(fusers)
            res.render('home', {
                title: 'Home',
                "users2": fusers
            });
        });
    }
};
