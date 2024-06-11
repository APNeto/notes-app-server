import express from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json())
app.use(cors())


app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes)
})

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send("title and content fields required");
    }
    try {
        const note = await prisma.note.create({
            data: { title, content }
        })
        res.send(note)
    }
    catch (error) {
        res.status(500).send("Error on server while creating note")
    }
})

app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid number");
    }
    if (!title || !content) {
        return res.status(400).send("title and content fields required");
    }
    try {
        const note = await prisma.note.update({
            data: { title, content },
            where: { id: id }
        })
        res.status(201).send(note)
    } catch (error) {
        res.status(500).send("Error on server while updating note")
    }
})

app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid number")
    }
    try {
        await prisma.note.delete({
            where: { id }
        })
        res.status(200).send("Note delete successfully")
    } catch (error) {
        res.status(500).send("Error on server while deleting note")
    }
})

app.listen(5000, () => {
    console.log("server running on localhost:5000")
})