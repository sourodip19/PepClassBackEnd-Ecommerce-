import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exits' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    return res
      .status(201)
      .json({ message: 'User created successfully', user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error in signup controller' });
  }
};
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not exist ! Please signUp' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Password do not match try again' });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    return res.status(200).json({ message: 'Successfully loggedIn', token });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: 'Error in login controller' });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const Users = await User.find();
    if (Users.length == 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    return res.status(200).json({ message: 'All the users -> ', Users });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: 'Error is getAllUsers Controller' });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }
    await User.findByIdAndDelete(user._id);
    return res.status(200).json({ message: 'User deleted Successfully', user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error in deleteUser Controller' });
  }
};
export const editUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password, role } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User does not exists' });
    }
    const updatedata = {};
    if (name) updatedata.name = name;
    if (email) updatedata.email = email;
    if (role) updatedata.role = role;
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updatedata.password = hashedPassword;
    }
    await User.findByIdAndUpdate(user._id, updatedata, { new: true });
    return res.status(200).json({ message: 'User updated successfully' }, user);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: 'Error in editUser controller' });
  }
};
