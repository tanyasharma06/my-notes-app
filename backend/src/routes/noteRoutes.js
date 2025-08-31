import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addNote, fetchNotes, updateNote, deleteNote } from "../controllers/notesController.js";

const router = Router();
router.post("/", auth(), addNote);
router.get("/", auth(), fetchNotes);
router.put("/:id", auth(), updateNote);
router.delete("/:id", auth(), deleteNote);

export default router;
