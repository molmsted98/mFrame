const Post = require('../models/Post');
const User = require('../models/User');
const Style = require('../models/Style');

const positions = [
    [0, 2, -1.9],
    [1.9, 4, 1],
    [-1, 3, 1.9],
    [-1.9, 2, -1],
    [0, 4, -1.9],
    [1.9, 2, -1],
    [1, 2, 1.9],
    [-1.9, 4, 1]
]

/**
 * GET /
 * Upload page.
 */
exports.index = (req, res) => {
    res.render('vr/upload', {
        title: 'Upload'
    });
};

exports.styleIndex = (req, res) => {
    res.render('vr/uploadStyle', {
        title: 'Upload Style'
    });
};

exports.getUploads = (req, res, next) => {
    Post.find({
        id: req.user._id
    }).lean().exec((err, posts) => {
        var filenames = [];
        for (i = 0; i < posts.length; i++) {
            var object = posts[i];
            filenames.push(object.fileName);
        }
        res.render('vr/upload', {
            "filenames": filenames
        });
    });
};

/**
 * GET /
 * Success page.
 */
exports.postUpload = (req, res, next) => {
    var numPo

    if (req.body.type == "Post") {
        Post.find({
            id: req.user.id
        }).lean().exec((err, posts) => {
            numPo = posts.length
            console.log(numPo)
            const post = new Post({
                id: req.user.id,
                fileName: req.file.filename,
                coordinates: positions[numPo]
            });
            post.save((err) => {
                req.flash('failure', {
                    msg: 'File was not uploaded successfully.'
                });
                return next(err);
            });
            req.flash('success', {
                msg: 'File was uploaded successfully.'
            });
            return res.redirect('/upload');
        });
    } else {
        //Remove the existing style.
        Style.find({
            id: req.user.id,
            type: req.body.type
        }).remove().exec();

        const style = new Style({
            id: req.user.id,
            fileName: req.file.filename,
            type: req.body.type
        });

        style.save((err) => {
            if (err) {
                req.flash('failure', {
                    msg: 'File was not uploaded successfully.'
                });
                return next(err);
            }
        });
        req.flash('success', {
            msg: 'File was uploaded successfully.'
        });
        return res.redirect('/upload');
    }
};

/***
 * Makes sure that the file to be uploaded won't break the site.
 */
exports.validateUpload = (req, res, next) => {
    if (req.file != undefined) {
        return next();
    }
    req.flash('failure', {
        msg: 'File was not uploaded successfully.'
    });
    res.redirect('/upload');
};
