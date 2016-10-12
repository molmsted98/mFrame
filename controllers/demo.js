/**
 * GET /
 * Demo page.
 */
exports.index = (req, res) => {
    res.render('vr/demo', {
        title: 'Demo'
    });
};
