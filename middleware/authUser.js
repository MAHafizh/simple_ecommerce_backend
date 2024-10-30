import Users from "../models/usermodel.js";

export const VerifyUser = async (req, res, next) => {
  if (!req.session.uuid) {
    return res.status(401).json({ msg: "Mohon login kembali" });
  }
  const user = await Users.findOne({
    where: {
      uuid: req.session.uuid,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  req.uuid = user.isSoftDeleted;
  req.role = user.role;
  next();
};

export const AdminOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      uuid: req.session.uuid,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  if(user.role !== "admin") return res.status(403).json({ msg: "Akses terlarang" });
  next();
};
