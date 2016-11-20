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

/***
 * GET /api/users/:userId/following
 * Returns a list of the usernames of users' following.
 */
exports.getFollowing = (req, res, next) => {
    User.findOne({
        _id: req.params.userId
    }).lean().exec((err, user) => {
        followingIds = user.following;
        User.find({
            _id: {
                $in: followingIds
            }
        }).exec((err, following) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(following);
        });
    });
};
