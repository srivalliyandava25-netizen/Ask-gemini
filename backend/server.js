const express = require("express");

require("dotenv").config();

const path = require("path");

const ai = require("./gemini");

const app = express();
    
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


app.post("/ask", async (req, res) => {

    try {

        const question = req.body.question;

        console.log("Question received:", question);

        if (!question || question.trim() === "") {
            return res.status(400).json({
                error: "Question is required"
            });
        }


        const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: question
        });


        console.log("Gemini response received");


        res.json({
            answer: response.text
        });


    } catch (error) {

        console.error("Gemini API Error:", error);

        if (error.status === 503) {
        return res.status(503).json({
            error: "Gemini is temporarily busy. Please try again in a few seconds."
        });
    }

        res.status(500).json({
            error: error.message || "Failed to get answer from Gemini"
        });

    }

});


app.listen(3000, () => {
    console.log("Ask Gemini backend is running on port 3000");
});