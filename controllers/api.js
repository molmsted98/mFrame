const User = require('../models/User');
const Post = require('../models/Post');
const Style = require('../models/Style');

/***
 * GET /api/users/:userId/followers
 * Return a list of the usernames that are following the user with userId
 */
exports.getFollowers = (req, res, next) => {
    User.findOne({
        _id: req.params.userId
    }).exec((err, theUser) => {
        User.find({
            following: theUser._id
        }).exec((err, followers) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(followers);
        });
    });
};
