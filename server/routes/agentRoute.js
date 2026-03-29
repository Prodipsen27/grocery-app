import express from "express";
import authUser from "../middleware/authUser.js";
import { runAgentLoop } from "../agent/agent.js";
import User from "../models/user.js";

const router = express.Router();
router.post('/chat', authUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const history = user.agentHistory || [];
    history.push({ role: 'user', content: message });
    
    // Pass history and username to agent loop
    const { reply, toolCalls, updatedHistory } = await runAgentLoop(history, userId, user.name);
    
    // Save updated history back to DB
    await User.findByIdAndUpdate(userId, { agentHistory: updatedHistory });

    res.json({ reply, toolCalls });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
});

// Fetch user history
router.get('/history', authUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
       return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, history: user.agentHistory || [] });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
});

export default router;