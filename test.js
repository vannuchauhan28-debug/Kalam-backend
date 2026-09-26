const db = require("./firebase");

async function addStudent() {
    await db.collection("students").add({
        name: "Test Student",
        email: "test@example.com",
        course: "Java",
        progress: 50
    });

    console.log("Student data saved successfully!");
}

addStudent();