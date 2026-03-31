import type { Context } from "hono";
import pool from "../config/db.js";
import type { CreatePostModel, PostModel } from "../models/ticket.model.js";
import type { ResultSetHeader } from "mysql2";

export async function getAllPosts(context: Context) {
  try {
    const user_id = context.req.query('user_id');

    let rows;

    if (user_id) {
      [rows] = await pool.query<PostModel[]>(
        `SELECT * FROM ticket WHERE user_id = ?`, [user_id]
      );
    } else {
      [rows] = await pool.query<PostModel[]>(`SELECT * FROM ticket`);
    }

    return context.json(rows, 200);
  } catch (error) {
    console.log(error);
    return context.json({ message: 'Internal server error' }, 500);
  }
}

export async function getPostById(context: Context) {
  try { 
    const id = context.req.param('id');
    const [rows] = await pool.query<PostModel[]>(`SELECT * FROM Ticket WHERE id = ?`, [id]);
    const data = rows[0];

    if (data) {
      return context.json(data, 200);
    }

    return context.json(null, 200);
  } catch (error) {
    console.log(error);
    return context.json({ message: 'Internal server error' }, 500);
  }
}

export async function createPost(context: Context) {
  try {
    const body: CreatePostModel = await context.req.json();

    if (!body.user_id) {
      return context.json({ message: "User ID is required" }, 400);
    }

    if (!body.title) {
      return context.json({ message: "Title is required" }, 400);
    }

    if (!body.type_of_report) {
      return context.json({ message: "Type of report is required" }, 400);
    }

    if (!body.category) {
      return context.json({ message: "Category is required" }, 400);
    }

    if (!body.description) {
      return context.json({ message: "Description is required" }, 400);
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Ticket 
      (user_id, title, type_of_report, category, description, attachment) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        body.user_id,
        body.title,
        body.type_of_report,
        body.category,
        body.description,
        body.attachment || null
      ]
    );

    if (result.insertId) {
      const [data] = await pool.query<PostModel[]>(`SELECT * FROM ticket WHERE id = ?`, [result.insertId]);
      return context.json(data[0], 201);
    }

    return context.json({ message: "Failed to create report" }, 400);
  } catch (error) {
    console.log(error);
    return context.json({ message: "Internal server error" }, 500);
  }
}

export async function deletePostById(context: Context) {
  try {
    const id = context.req.param('id');
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM Ticket WHERE id = ?`, 
      [id]
    );

    if (result.affectedRows > 0) {
      return context.json({ message: "Report successfully deleted" }, 200);
    }

    return context.json({ message: "Report not found" }, 404);
  } catch (error) {
    console.log(error);
    return context.json({ message: "Internal server error" }, 500);
  }
}