import express from "express";
import Thread from "../models/thread.js";
import getOpenAiAPIResponse from "../utils/openai.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();


const router = express.Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "nishi",
            title: "Testing 2nd thread"
        });
        const response = await thread.save();
        res.send(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB" });
    }
});


//get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch chat" });
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ success: "Thread deleted successfully" });
    } catch {
        console.log(err);
        res.status(500).json({ error: "failed to delete thread" });
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: []
            });
        }

        thread.messages.push({ role: "user", content: message });

        const assistantReply = await getOpenAiAPIResponse(message);

        // 🔴 FIX HERE
        if (!assistantReply) {
            console.error("Empty AI response");
            return res.status(500).json({ error: "AI returned empty response" });
        }



        thread.messages.push({ role: "assistant", content: assistantReply });

        thread.updatedAt = new Date();
        await thread.save();

        res.json({ reply: assistantReply });

    } catch (err) {
        console.error("Server Error:", err.message);
        res.status(500).json({ error: "something went wrong" });
    }
});
export default router;