import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: "User exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash, role: role || "user" });
    return res.json({ ok: true, user: { id: user._id, username: user.username } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ sub: user._id.toString(), username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, refreshToken, user: { id: user._id, username, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
