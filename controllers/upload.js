const Post = require('../models/Post');
const User = require('../models/User');
const Style = require('../models/Style');
const fs = require('fs');

//Preset positions for posts.
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

/***
 * GET /upload
 * Show upload page along with current uploads.
 */
exports.index = (req, res, next) => {
    //Find all filenames of posts for user to show on upload page.
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
 * GET /upload
 * After the file has been transfered, update database.
 */
exports.postUpload = (req, res, next) => {
    var numPo;
    var fileExtension = 'image';

    //When calling req.file.mimetype
    //.gif = image/gif
    //.png = image/png
    //.jpg = image/jpeg
    //.jpeg = image/jpeg

    //Prevents the user from uploading nothing.
    //TODO: Show an error message here.
    if (req.file === undefined) {
        req.flash('failure', {
            msg: 'Please select a file before uploading.'
        });
        return res.redirect('/upload');
    }

    //Set the filetypes so they are displayed properly.
    if (req.file.mimetype == 'image/gif') {
        fileExtension = 'gif';
    } else if (req.file.mimetype == 'some movie type') {
        //Eventually have support for videos?
    } else if (req.file.mimetype == 'image/png' || req.file.mimetype == 'image/jpeg') {
        //Come up with something better, to include obscure image types.
        fileExtension = 'image';
    } else {
        //Not an image, shouldn't be able to get here.
    }

    if (req.body.type == "Post") {
        //An image has been selected to be deleted.
        if (req.body.selected >= 0) {
            //Get all of the users' posts.
            Post.find({
                id: req.user.id
            }).lean().exec((err, posts) => {
                //Get information about the selected post.
                var pId = posts[parseInt(req.body.selected)]._id;
                var pFileName = posts[parseInt(req.body.selected)].fileName;
                //Remove Post from database.
                Post.find({
                    id: req.user.id,
                    _id: pId
                }).remove().exec();
                //Remove Post from the server directory.
                fs.exists('./public/uploads/' + pFileName, function(exists) {
                    if (exists) {
                        console.log('File exists. Deleting now ...');
                        fs.unlink('./public/uploads/' + pFileName);
                    } else {
                        console.log('File not found, so not deleting.');
                    }
                });
            });
        }

        //Setup the post with proper coordinates.
        Post.find({
            id: req.user.id
        }).lean().exec((err, posts) => {
            numPo = posts.length
            var post;
            if (parseInt(req.body.selected) < 0) {
                post = new Post({
                    id: req.user.id,
                    fileName: req.file.filename,
                    coordinates: positions[numPo],
                    fileType: fileExtension
                });
                //This post is replacing another one, use those coords.
            } else {
                post = new Post({
                    id: req.user.id,
                    fileName: req.file.filename,
                    coordinates: posts[parseInt(req.body.selected)].coordinates,
                    fileType: fileExtension
                });
            }
            //Save the post to database.
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
        //Not a post, so it must be a style upload (wall, floor, etc.)
    } else {
        //See if that type of upload has already happened, delete if so.
        Style.findOne({
            id: req.user.id,
            type: req.body.type
        }).exec((err, style) => {
            //Only try to delete if the style already exists in database.
            if (style != null) {
                //Remove style from the server directory.
                fs.exists('./public/uploads/' + style.fileName, function(exists) {
                    if (exists) {
                        console.log('File exists. Deleting now ...');
                        fs.unlink('./public/uploads/' + style.fileName);
                    } else {
                        console.log('File not found, so not deleting.');
                    }
                });
                //Remove the style from the database.
                Style.findOne({
                    id: req.user.id,
                    type: req.body.type
                }).remove().exec();
            }

            //Setup the new style for database.
            const newStyle = new Style({
                id: req.user.id,
                fileName: req.file.filename,
                type: req.body.type
            });

            //Save the new style for the database.
            newStyle.save((err) => {
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
        });
    }
};
