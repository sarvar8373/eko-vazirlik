import express from "express";
import { DB } from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
const salt = 10;

router.post("/login", (req, res) => {
  const { phone_number, password } = req.body;
  const sql = "SELECT * FROM users WHERE (phone_number = ?)";
  const values = [phone_number];

  DB.query(sql, values, (err, result) => {
    if (err)
      return res.status(500).json({ loginStatus: false, Error: "Query error" });

    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (err) {
          return res
            .status(500)
            .json({ loginStatus: false, Error: "Error comparing passwords" });
        }

        if (response) {
          const { id, phone_number, full_name, role } = result[0];
          const token = jwt.sign(
            { id, phone_number, full_name, role },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );

          res.cookie("token", token);
          return res.json({ loginStatus: true });
        } else {
          return res
            .status(401)
            .json({ loginStatus: false, Error: "Wrong email or password" });
        }
      });
    } else {
      return res
        .status(401)
        .json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

router.post("/add_user", (req, res) => {
  const { phone_number, full_name, password, role = "user" } = req.body;
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ Status: false, Error: "Error hashing password" });
    }

    const sql = `INSERT INTO users (phone_number, full_name, password, role) VALUES (?, ?, ?, ?)`;
    const values = [phone_number, full_name, hash, role];

    DB.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Status: false, Error: "Query error" });
      }

      return res.json({ Status: true });
    });
  });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ Status: false, Message: "Token not provided" });
  } else {
    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ Status: false, Message: "Authentication error" });
      } else {
        req.phone_number = decoded.phone_number;
        req.full_name = decoded.full_name;
        req.role = decoded.role;
        req.id = decoded.id;
        next();
      }
    });
  }
};

router.get("/user", verifyUser, (req, res) => {
  return res.json({
    Status: true,
    phone_number: req.phone_number,
    full_name: req.full_name,
    role: req.role,
    id: req.id,
  });
});

router.put("/user/:id", verifyUser, (req, res) => {
  const { phone_number, full_name, password, role } = req.body;
  const userID = req.params.id;

  bcrypt.hash(password, salt, (hashErr, hash) => {
    if (hashErr) {
      console.error(hashErr);
      return res
        .status(500)
        .json({ Status: false, Error: "Error hashing password" });
    }

    const sql = `UPDATE users SET phone_number=?, full_name=?, password=?, role=? WHERE id=?`;
    const values = [phone_number, full_name, hash, role, userID];

    DB.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Status: false, Error: "Query error" });
      }

      if (result.affectedRows > 0) {
        return res.json({ Status: true, Message: "User updated successfully" });
      } else {
        return res
          .status(404)
          .json({ Status: false, Error: "User not found or not updated" });
      }
    });
  });
});

router.get("/user/:id", (req, res) => {
  const userID = req.params.id;
  const sql = `SELECT * FROM users WHERE id = ?`;

  DB.query(sql, [userID], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: "Query error" });
    }

    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0] });
    } else {
      return res.status(404).json({ Status: false, Error: "User not found" });
    }
  });
});

router.get("/users", (req, res) => {
  const sql = `SELECT * FROM users`;

  DB.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: "Query error" });
    }

    return res.json({ Status: true, Result: result });
  });
});

router.delete("/user/:id", (req, res) => {
  const userID = req.params.id;
  const sql = `DELETE FROM users WHERE id = ?`;

  DB.query(sql, [userID], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: "Query error" });
    }

    if (result.affectedRows > 0) {
      return res.json({ Status: true, Message: "User deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ Status: false, Error: "User not found or already deleted" });
    }
  });
});

export { router as AdminRouter };
