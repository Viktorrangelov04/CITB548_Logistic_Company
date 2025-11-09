import User from "../models/userModel.js";
import { ObjectId } from "mongodb";

export const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Missing user ID" });

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUsersByRole = async (req, res) => {
  const { role } = req.query;
  if (!role) return res.status(400).json({ message: "Missing user role" });

  try {
    const users = await User.find({ role });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users", error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id || !role) return res.status(400).json({ message: "Missing id or new role" });

  try {
    const result = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!result) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Role updated successfully", user: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Missing user ID" });

  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
