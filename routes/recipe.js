  
const fs = require('fs');

exports.addRecipePage = (req, res) => {
    res.render('add-recipe.ejs', {
        title: " Welcome to MyFood | Add a new Recipe",
        message: ''
    });
};

exports.addRecipe = (req, res) => {
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }

    let message = '';
    let name = req.body.name;
    let protein = req.body.protein;
    let carb = req.body.carb;
    let vegtebale = req.body.vegtebale;
    let uploadedFile = req.files.image;
    let image_name = uploadedFile.name;
    let fileExtension = uploadedFile.mimetype.split('/')[1];
    image_name = name + '.' + fileExtension;

    let nameQuery = "SELECT * FROM `recipe_` WHERE name = '" +  name + "'";

    db.query( nameQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        if (result.length > 0) {
            message = 'recipe name already exists';
            res.render('add-recipe.ejs', {
                message,
                title: " Welcome to MyFood | Add a new Recipe "
            });
        } else {
            // check the filetype before uploading it
            if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                // upload the file to the /public/assets/img directory
                uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    // send the recipe  details to the database
                    let query = "INSERT INTO `recipe_` (name, protein, carb, vegtebale, image) VALUES ('" + name + "', '" + protein + "', '" + carb + "', '" + vegtebale + "', '" + image_name + "')";
                    db.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/');
                    });
                });
            } else {
                message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                res.render('add-recipe.ejs', {
                    message,
                    title: " Welcome to MyFood | Add a new Recipe "
                });
            }
        }
    });
}

exports.editRecipePage = (req, res) => {
    let reciperId = req.params.id;
    let query = "SELECT * FROM `recipe_` WHERE id = '" + reciperId + "' ";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('edit-recipe.ejs', {
            title: "Edit  Recipe",
  
            message: ''
        });
    });
}

exports.editRecipe = (req, res) => {
    let recipeId = req.params.id;
    let name = req.body.name;
    let protein = req.body.protein;
    let carb = req.body.carb;
    let vegtebale = req.body.vegtebale;

    let query = "UPDATE `recipe_` SET `name` = '" + name + "', `protein` = '" + protein + "', `carb` = '" + carb + "', `vegtebale` = '" + vegtebale + "' WHERE `recipe_`.`id` = '" + recipeId + "'";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
}

exports.deleteRecipe = (req, res) => {
    let recipeId = req.params.id;
    let getImageQuery = 'SELECT image from `recipe_` WHERE id = "' + recipeId + '"';
    let deleteUserQuery = 'DELETE FROM recipe_ WHERE id = "' + recipeId + '"';

    db.query(getImageQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        let image = result[0].image;

        fs.unlink(`public/assets/img/${image}`, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            db.query(deleteUserQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/');
            });
        });
    });
}
