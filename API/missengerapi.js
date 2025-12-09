const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("users.db");
const SECRET = "1234";

// Register
app.post("/Missenger/Register", (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send("Error hashing password.");

        db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hash],
            (err) => {
                if (err) return res.status(400).send("User already exists.");
                res.send("Account created!");
            }
        );
    });
});

// Login
app.post("/Missenger/Login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (!user) return res.status(400).send("User not found.");

        bcrypt.compare(password, user.password, (err, match) => {
            if (!match) return res.status(403).send("Wrong password.");

            const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
            res.json({ token });
        });
    });
});

// Protected example route
app.get("/Missenger/Profile", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("No token.");

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid token.");
        res.json({ message: "Profile data", user });
    });
});

// Start HTTP server
app.listen(6700, "0.0.0.0", () => {
    console.log("API running on port 6700");
});
