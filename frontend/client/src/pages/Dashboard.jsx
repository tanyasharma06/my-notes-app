import React, { useEffect, useState } from "react";
import { useAuth } from "../store";
import { api } from "../api";
import { notesCache } from "../store";
import { connectSocket, socket } from "../socket";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setMore] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("online");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    if (user?.id) connectSocket(user.id);
    socket.on("note:added", ({ note }) => setNotes((n) => [note, ...n]));
    socket.on("note:updated", ({ note }) => setNotes((n) => n.map((item) => item._id === note._id ? note : item)));
    socket.on("note:deleted", ({ id }) => setNotes((n) => n.filter((item) => item._id !== id)));
    return () => {
      socket.off("note:added");
      socket.off("note:updated");
      socket.off("note:deleted");
    };
  }, [user?.id]);

  const load = async () => {
    setStatus(navigator.onLine ? "online" : "offline");
    if (!navigator.onLine) {
      const cached = await notesCache.getItem("page:" + page);
      if (cached) {
        setNotes((n) => [...n, ...cached.items]);
        setMore(cached.items.length > 0);
      }
      return;
    }
    const { data } = await api(token).get("/notes", { params: { page, limit: 20 } });
    setNotes((n) => [...n, ...data.items]);
    setMore(data.items.length > 0);
    await notesCache.setItem("page:" + page, data);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page]);

  const add = async () => {
    if (!title && !body) return;
    await api(token).post("/notes", { title, body });
    setTitle(""); setBody("");
    // server will push realtime "note:added"
  };

  const startEdit = (note) => {
    setEditingNote({ ...note });
  };

  const saveEdit = async () => {
    if (!editingNote) return;
    await api(token).put(`/notes/${editingNote._id}`, {
      title: editingNote.title,
      body: editingNote.body
    });
    setEditingNote(null);
    // server will push realtime "note:updated"
  };

  const deleteNote = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    await api(token).delete(`/notes/${id}`);
    // server will push realtime "note:deleted"
  };

  return (
    <div>
      <div className="status">
        <strong>Status:</strong> {status}
      </div>

      <div className="add-note">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>

      <ul className="note-list">
        {notes.map((n) => (
          <li key={n._id} className="note-item">
            <div className="note-title">{n.title || "(untitled)"}</div>
            <div className="note-body">{n.body}</div>
            <small className="note-date">{new Date(n.createdAt).toLocaleString()}</small>
            <div className="note-actions">
              <button onClick={() => startEdit(n)}>Edit</button>
              <button onClick={() => deleteNote(n._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {hasMore ? (
        <button className="load-more" onClick={() => setPage((p) => p + 1)}>Load more</button>
      ) : (
        <div>No more notes</div>
      )}

      {editingNote && (
        <div className="edit-note-modal">
          <h3>Edit Note</h3>
          <input
            placeholder="Title"
            value={editingNote.title}
            onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
          />
          <input
            placeholder="Body"
            value={editingNote.body}
            onChange={(e) => setEditingNote({ ...editingNote, body: e.target.value })}
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditingNote(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
