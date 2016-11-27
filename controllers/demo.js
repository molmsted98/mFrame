/**
 * GET /
 * Demo page.
 */
exports.index = (req, res) => {
    res.render('vr/demo', {
        title: 'Demo'
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
