const Post = require('../models/Post');

/**
 * GET /
 * Upload page.
 */
exports.index = (req, res) => {
  res.render('vr/upload', {
    title: 'Upload'
  });
};

/**
 * GET /
 * Success page.
 */
exports.postUpload = (req, res, next) => {
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
};
