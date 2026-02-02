import User from "../models/userModel.js";

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
  try {
    const { role } = req.query;
    const users = role ? await User.find({ role }) : await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get users",
      error: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id || !role)
    return res.status(400).json({ message: "Missing id or new role" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "Role updated successfully", user: updatedUser });
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

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      role: role || "client",
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
