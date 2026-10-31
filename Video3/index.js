const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;


// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static("public"));

// JSON file location
const filePath = path.join(__dirname, "participants.json");

// Read participants from JSON file
function readParticipants() {
    if (!fs.existsSync(filePath)) {
        return [];
    }

    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}

// Save participants to JSON file
function saveParticipants() {
    fs.writeFileSync(
        filePath,
        JSON.stringify(participants, null, 2)
    );
}

// Load existing participants when server starts
let participants = readParticipants();

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to College Event Registration API!");
});

// GET: View all participants
app.get("/participants", (req, res) => {
    res.json(participants);
});

// GET: View one participant
app.get("/participants/:id", (req, res) => {
    const id = Number(req.params.id);

    const participant = participants.find(p => p.id === id);

    if (!participant) {
        return res.status(404).json({
            message: "Participant not found"
        });
    }

    res.json(participant);
});

// POST: Register a new participant
app.post("/participants", (req, res) => {
    const { name, event } = req.body;

    if (!name || !event) {
        return res.status(400).json({
            message: "Name and event are required"
        });
    }

    const newParticipant = {
        id: participants.length
            ? Math.max(...participants.map(p => p.id)) + 1
            : 1,
        name: name,
        event: event
    };

    participants.push(newParticipant);

    saveParticipants();

    res.status(201).json({
        message: "Participant registered successfully!",
        participant: newParticipant
    });
});

// PUT: Update participant details
app.put("/participants/:id", (req, res) => {
    const id = Number(req.params.id);

    const participant = participants.find(p => p.id === id);

    if (!participant) {
        return res.status(404).json({
            message: "Participant not found"
        });
    }

    const { name, event } = req.body;

    if (name) {
        participant.name = name;
    }

    if (event) {
        participant.event = event;
    }

    saveParticipants();

    res.json({
        message: "Participant updated successfully!",
        participant: participant
    });
});

// DELETE: Remove a participant
app.delete("/participants/:id", (req, res) => {
    const id = Number(req.params.id);

    const participantExists = participants.some(p => p.id === id);

    if (!participantExists) {
        return res.status(404).json({
            message: "Participant not found"
        });
    }

    participants = participants.filter(p => p.id !== id);

    saveParticipants();

    res.json({
        message: "Participant deleted successfully!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
