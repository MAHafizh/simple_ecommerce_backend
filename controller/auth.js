import Users from "../models/usermodel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });
  req.session.uuid = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  const image = user.image;
  const image_link = user.image_link;
  res.status(200).json({ uuid, name, email, role, image, image_link });
};

export const Me = async (req, res) => {
  if (!req.session.uuid) {
    return res.status(401).json({ msg: "Mohon login kembali" });
  }
  const user = await Users.findOne({
    attributes: ['uuid', 'name', 'email', 'role', 'image', 'image_link'],
    where: {
      uuid: req.session.uuid,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user)
};

export const Logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "Anda telah logout" });
  });
};
