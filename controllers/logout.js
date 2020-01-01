module.exports = (req, res) => {
    /*
    req.session.destroy(() => {
        res.redirect('/')
    })
    */
    req.logout();
    res.redirect('/');
};