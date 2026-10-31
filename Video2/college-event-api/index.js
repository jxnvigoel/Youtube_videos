const express = require("express");
const app = express();
const participantRouter = express.Router();
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
let participants = [];
let nextId = 1;
const PORT = 3000;
app.use(express.json());
app.use(function(req, res, next) {
    console.log(req.method + " " + req.url);
    next();
});
app.get("/participants", function(req, res) {
    res.status(200).json(participants);
});

app.post("/participants", function(req, res) {
    const newParticipant = {
        id: nextId++,
        name: req.body.name,
        email: req.body.email,
        event: req.body.event
    };

    participants.push(newParticipant);

    res.status(201).json({
        message: "Registration successful!",
        participant: newParticipant
    });
});
app.put("/participants/:id", function(req, res) {
    const id = Number(req.params.id);

    const participant = participants.find(function(p) {
        return p.id === id;
    });

    if (!participant) {
        return res.status(404).json({
            message: "Participant not found"
        });
    }

    participant.name = req.body.name || participant.name;
    participant.email = req.body.email || participant.email;
    participant.event = req.body.event || participant.event;

    res.status(200).json({
        message: "Participant updated successfully",
        participant: participant
    });
});
app.delete("/participants/:id", function(req, res) {
    const id = Number(req.params.id);

    const index = participants.findIndex(function(p) {
        return p.id === id;
    });

    if (index === -1) {
        return res.status(404).json({
            message: "Participant not found"
        });
    }

    const deletedParticipant = participants.splice(index, 1);

    res.status(200).json({
        message: "Registration cancelled successfully",
        participant: deletedParticipant[0]
    });
});


app.listen(PORT, function() {
    console.log("Server is running on port " + PORT);
});

