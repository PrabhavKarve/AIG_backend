const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Welcome to the Server!"); // Send a welcome message
});

/* LOGIN section */
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await collection.findOne({ email: email });

        if (user) {
            // Check if the password matches the hashed password stored in the database
            const validPassword = password === user.password;
            if (validPassword) {
                res.json("exist"); // Login successful
            } else {
                res.json("invalidpassword"); // Invalid password
            }
        } else {
            res.json("notexist"); // Email not found
        }
    } catch (e) {
        res.json("fail");
    }
});

app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        const check = await collection.findOne({ email: email });
        console.log("req received from server");
        if (check) {
            console.log("sending existing response");
            res.json("exist");
        } else {
            // Create the user with the hashed password
            const data = {
                email: email,
                password: password
            };
            console.log("sending new response 3");
            await collection.insertMany([data]);
            res.json("notexist");
        }
    } catch (e) {
        res.json("fail");
    }
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
    return "Server is running on port 8000"
});
