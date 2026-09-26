const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const db = require("./firebase");

const app = express();

app.use(cors());
app.use(express.json());


// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Kalam Backend is Running 🚀");
});


// REGISTER
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, course } = req.body;

        const existing = await db.collection("users")
            .where("email", "==", email)
            .get();

        if (!existing.empty) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await db.collection("users").add({
            name: name,
            email: email,
            passwordHash: passwordHash,
            role: role,
            course: course || "",
            createdAt: new Date()
        });

        res.json({
            message: "Registration successful!"
        });

    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});


// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const snapshot = await db.collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(401).json({
                message: "No account found with this email"
            });
        }

        const user = snapshot.docs[0].data();

        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        res.json({
            message: "Login successful!",
            profile: {
                name: user.name,
                email: user.email,
                role: user.role,
                program: user.course
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});


// STUDENT DATA
app.post("/students", async (req, res) => {
    try {
        const { name, email, role, course, progress } = req.body;

        const student = await db.collection("students").add({
            name: name,
            email: email,
            role: role,
            course: course,
            progress: progress || 0
        });

        res.json({
            message: "Student saved successfully!",
            id: student.id
        });

    } catch (error) {
        console.error("Error:", error);

        res.status(500).json({
            message: "Error saving student",
            error: error.message
        });
    }
});


// START SERVER
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});