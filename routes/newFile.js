exports.searchRecipePage = (req, res) => {
    let recipeId = req.params.id;
    let query = "SELECT * FROM `recipe_` WHERE id = '" + recipeId + "' ";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('search - recipe.ejs', {
            title: "Edit Recipe"
            , recipe: result[0]
            , message: ''
        });
    });
},
    exports.searchRecipe = (req, res) => {
        let recipeId = req.params.id;
        let name = req.body.name;
        let protein = req.body.protein;
        let carb = req.body.carb;
        /* let vegtebale = req.body.vegtebale;*/

        let query = "SELECT * FROM `recipe_` WHERE id = '" + recipeId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    }