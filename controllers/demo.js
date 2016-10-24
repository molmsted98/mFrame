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
  * GET /gifTest
  */
exports.gifTest = (req, res) => {
    res.render('vr/gif', {
        title: 'GIFS'
    });
};

/**
  * GET /moveTest
  */
exports.moveTest = (req, res) => {
    res.render('vr/move', {
        title: 'Move'
    });
};
