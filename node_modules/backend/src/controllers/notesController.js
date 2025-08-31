import Note from "../models/Note.js";

export const addNote = async (req, res) => {
  try {
    const { title, body } = req.body;
    const note = await Note.create({ userId: req.user.sub, title, body });

    // Notify via WebSocket
    req.io.to(req.user.sub).emit("note:added", { note });
    res.json({ note });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const fetchNotes = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || "20", 10)));
    const skip = (page - 1) * limit;

    const query = req.user.role === "admin" ? {} : { userId: req.user.sub };
    const [items, total] = await Promise.all([
      Note.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Note.countDocuments(query)
    ]);

    res.json({ items, page, limit, total });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.user.sub },
      { title, body },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });

    // Notify via WebSocket
    req.io.to(req.user.sub).emit("note:updated", { note });
    res.json({ note });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, userId: req.user.sub });
    if (!note) return res.status(404).json({ error: "Note not found" });

    // Notify via WebSocket
    req.io.to(req.user.sub).emit("note:deleted", { id });
    res.json({ message: "Note deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
