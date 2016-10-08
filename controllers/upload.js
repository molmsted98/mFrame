const Post = require('../models/Post');
<<<<<<< HEAD
const User = require('../models/User');

const positions = [
  [0,2,-1.9],
  [1.9,4,1],
  [-1,4,1.9],
  [-1.9,2,-1],
  [0,4,-1.9],
  [1.9,2,-1],
  [1,2,1.9],
  [-1.9,4,1]
]
=======
const Style = require('../models/Style');
>>>>>>> 6acbe91d013c993d47c0ffdb240b1903b2b90ba4

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

/**
 * GET /
 * Success page.
 */
exports.postUpload = (req, res, next) => {
<<<<<<< HEAD

  var numPo

  Post.find({id: req.user.id}).lean().exec((err, posts) => {
    const l = posts.length
    numPo = posts.length
    console.log(numPo)



    const post = new Post({
      id: req.user.id,
      fileName: req.file.filename,
      coordinates: positions[numPo]
    });

    post.save((err) => {
=======
  console.log(req.body.type)
  if (req.body.type == "Post")
  {
    const post = new Post({
      id: req.user.id,
      fileName: req.file.filename,
      coordinates: [1.9,4,0]
    });

    post.save((err) => {
      if (err) {
        req.flash('failure', { msg: 'File was not uploaded successfully.' });
        return next(err);
      }
    });
    req.flash('success', { msg: 'File was uploaded successfully.' });
    return res.redirect('/upload');
  }
  else
  {
    const style = new Style({
      id: req.user.id,
      fileName: req.file.filename,
      type: req.body.type
    });

    style.save((err) => {
>>>>>>> 6acbe91d013c993d47c0ffdb240b1903b2b90ba4
      if (err) {
        req.flash('failure', { msg: 'File was not uploaded successfully.' });
        return next(err);
      }
    });
    req.flash('success', { msg: 'File was uploaded successfully.' });
    return res.redirect('/upload');
<<<<<<< HEAD

  });


 
=======
  }
>>>>>>> 6acbe91d013c993d47c0ffdb240b1903b2b90ba4
};
