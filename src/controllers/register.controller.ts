import type { Context } from "hono";
import pool from "../config/db.js";
import type { UserModel, RegisterModel, LoginModel } from "../models/user.model.js";
import type { ResultSetHeader } from "mysql2";

export async function register(context: Context) {
  try {
    const body: RegisterModel = await context.req.json();

    if (!body.full_name) 
        return context.json({ message: "Full name is required" }, 400
    );

    if (!body.student_id) 
        return context.json({ message: "Student ID is required" }, 400
    );

    if (!body.email) 
        return context.json({ message: "Email is required" }, 400
    );

    if (!body.password) 
        return context.json({ message: "Password is required" }, 400
    );

    const [existing] = await pool.query<UserModel[]>(
      `SELECT * FROM User WHERE email = ?`, [body.email]
    );

    if (existing.length > 0) {
      return context.json({ message: "Email already registered" }, 400);
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO User (full_name, student_id, email, password) VALUES (?, ?, ?, ?)`,
      [body.full_name, body.student_id, body.email, body.password]
    );

    if (result.insertId) {
      return context.json({ message: "Registered successfully" }, 201);
    }

    return context.json({ message: "Failed to register" }, 400);
  } catch (error) {
    console.log(error);
    return context.json({ message: "Internal server error" }, 500);
  }
}

export async function login(context: Context) {
  try {
    const body: LoginModel = await context.req.json();

    if (!body.email) return context.json({ message: "Email is required" }, 400);
    if (!body.password) return context.json({ message: "Password is required" }, 400);

    if (body.email === 'admin@liceo.edu.ph' && body.password === '123123123') {
      return context.json({
        id: 0,
        full_name: 'Admin',
        email: 'admin@liceo.edu.ph',
        role: 'admin'
      }, 200);
    }

    const [rows] = await pool.query<UserModel[]>(
      `SELECT * FROM User WHERE email = ? AND password = ?`,
      [body.email, body.password]
    );

    const user = rows[0];

    if (!user) {
      return context.json({ message: "Invalid email or password" }, 401);
    }

    return context.json({
      id: user.id,
      full_name: user.full_name,
      student_id: user.student_id,
      email: user.email,
      role: 'student'
    }, 200);

  } catch (error) {
    console.log(error);
    return context.json({ message: "Internal server error" }, 500);
  }
  
}

export async function resetPassword(context: Context) {
  try {
    const body = await context.req.json();

    if (!body.email) return context.json({ message: "Email is required" }, 400);
    if (!body.password) return context.json({ message: "Password is required" }, 400);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE User SET password = ? WHERE email = ?`,
      [body.password, body.email]
    );

    if (result.affectedRows > 0) {
      return context.json({ message: "Password reset successfully" }, 200);
    }

    return context.json({ message: "Email not found" }, 404);
  } catch (error) {
    console.log(error);
    return context.json({ message: "Internal server error" }, 500);
  }
}