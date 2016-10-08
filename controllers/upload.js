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
exports.postUpload = (req, res) => {
  req.flash('success', { msg: 'File was uploaded successfully.' });
  return res.redirect('/upload');
};
