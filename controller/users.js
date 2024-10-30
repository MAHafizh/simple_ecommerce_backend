import Users from "../models/usermodel.js";
import argon2, { hash } from "argon2";
import { Url } from "url";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Op } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getUser = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ["uuid", "name", "email", "role", "image", "image_link"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ["uuid", "name", "email", "role", "image", "image_link"],
      where: {
        uuid: req.params.uuid,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const postUser = async (req, res) => {
  const { name, email, password, confPassword, role, phone, birthdate } = req.body;

  const image = req.file;
  let UserImage;
  if(image) {
    UserImage = image.filename
  } else {
    UserImage = "default-image.jpg"
  }

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  const existingUser = await Users.findOne({
    where: { email: email },
  });
  if (existingUser) {
    return res.status(400).json({ msg: "Email already registered" });
  }

  const hashPassword = await argon2.hash(password);

  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
      image: UserImage,
      date_of_birth: birthdate,
      phone: phone
    });
    res.status(201).json({ msg: "Register berhasil" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });

  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  const { name, email, password, confPassword, role } = req.body;

  let hashPassword;

  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password not match" });
  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          uuid: user.uuid,
        },
      }
    );
    res.status(200).json({ msg: "User berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  try { 
    await Users.destroy({
      where: {
        uuid: user.uuid,
      },
    });
    res.status(200).json({ msg: "User berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};