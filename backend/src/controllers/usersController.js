const { createUser, getUserByEmail, updateUser, activateUser, getAllUsersFromDB } = require('../models/usersModel');
const bcrypt = require('bcrypt'); // para hash de contraseñas

async function registerUser(req, res) {
  const { firstName, lastName, email, password, role } = req.body;
  if(!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({error: "Faltan datos"});
  }
  
  const existing = await getUserByEmail(email);
  if(existing) {
    return res.status(409).json({error: "El email ya está registrado"});
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await createUser(firstName, lastName, email, passwordHash, role);
  res.status(201).json({ message: "Usuario creado con éxito", userId });
}

async function getAllUsers(req, res) {
  const users = await getAllUsersFromDB();
  res.json(users);
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json({error: "Email y password son requeridos"});
  }

  const user = await getUserByEmail(email);
  if(!user) {
    return res.status(401).json({error: "Credenciales inválidas"});
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if(!valid) {
    return res.status(401).json({error: "Credenciales inválidas"});
  }
  
  const { password_hash, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
}

async function updateUserInfo(req, res) {
  const userId = req.params.id;
  const { firstName, lastName, password } = req.body;
  let passwordHash;
  if(password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  const updatedUser = await updateUser(userId, { firstName, lastName, passwordHash });
  if(!updatedUser) {
    return res.status(404).json({error: "Usuario no encontrado"});
  }

  res.json({ message: "Usuario actualizado", user: updatedUser });
}

async function setUserActive(req, res) {
  const userId = req.params.id;
  const { active } = req.body;
  const updatedUser = await activateUser(userId, active);
  if(!updatedUser) {
    return res.status(404).json({error: "Usuario no encontrado"});
  }
  res.json({ message: "Estado actualizado", user: updatedUser });
}

module.exports = {
  registerUser,
  loginUser,
  updateUserInfo,
  setUserActive,
  getAllUsers
};
