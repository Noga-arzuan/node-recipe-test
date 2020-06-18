module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT id, carb,vegtebale,protein,name,image FROM recipe_ ORDER BY id ASC"; // query database to get all the recipe

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: " Welcome to MyFOOD | Add a new Recipe"
                , recipe_: result
            });
        });
    },
};