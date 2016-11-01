/**
 * GET /
 * Demo page.
 */
exports.index = (req, res) => {
    Post.find({
        id: req.user._id
    }).lean().exec((err, tags) => {
        var filenames = tags;
        res.render('vr/upload', {
            "filenames": filenames,
            "tags": tags
        });
    });
};

/**
  * GET /gifTets
  */
exports.gifTest = (req, res) => {
    res.render('vr/gif', {
        title: 'GIFS'
    });
};
