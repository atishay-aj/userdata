const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();


app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/userapiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = {
    username: {
        type: String,
        required: true
    },
    email: String,
    password: String
};
const User = mongoose.model("User", userSchema);

//TODO
//////////////////////////Targeting all users///////////////////////////////////
app.route("/api/users")
    .get(function(req, res) {
        User.find({}, { _id: 0, username: 1, email: 1 }, function(err, foundUsers) {
            if (!err) {
                res.json(foundUsers);
            } else {
                res.send(err);
            }
        })
    })
    .post(function(req, res) {

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        newUser.save(function(err) {
            if (!err) {
                res.send("success added user");
            } else {
                res.send(err);
            }
        });
    });

////////////////////////Targeting a specific user////////////////////////
app.route("/api/users/:username")
    .get(function(req, res) {


        User.findOne({ username: req.params.username }, { _id: 0, username: 1, email: 1 }, function(err, foundUser) {
            if (!err) {
                if (!foundUser) {
                    res.send("not user found");
                } else {
                    res.json(foundUser);

                }
            } else {
                res.send(err);
            }
        })
    })
    .put(function(req, res) {
        User.update({ username: req.params.username }, { username: req.body.username, email: req.body.email, password: req.body.password }, { overwrite: true },
            function(err) {
                if (!err) {
                    res.send("updated");
                }
            }
        )
    })

    .delete(function(req, res) {
        User.deleteOne({ username: req.params.username },
            function(err) {
                if (err) {
                    res.send(err)
                } else {
                    res.send("deleted")
                }
            }
        )
    });




app.listen(process.env.PORT || 3000,function () {
	console.log("Server is running");
	// body...
})