const Post = require('../models/Post');
const Style = require('../models/Style');

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
      if (err) {
        req.flash('failure', { msg: 'File was not uploaded successfully.' });
        return next(err);
      }
    });
    req.flash('success', { msg: 'File was uploaded successfully.' });
    return res.redirect('/upload');
  }
};
