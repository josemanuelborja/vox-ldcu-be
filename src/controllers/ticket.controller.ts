import type { Context } from "hono";
import pool from "../config/db.js";
import type { CreatePostModel, PostModel, UpdatePostModel } from "../models/ticket.model.js";
import type { ResultSetHeader } from "mysql2";

export async function getAllPosts(context: Context) {
  try {
    const user_id = context.req.query('user_id');

    let rows;

    if (user_id) {
      [rows] = await pool.query<PostModel[]>(
       `SELECT ticket.*, user.full_name as submitted_by
        FROM ticket
        JOIN user ON ticket.user_id = user.id
        WHERE ticket.user_id = ?
        ORDER BY ticket.create_time DESC`, [user_id]
      );
    } else {
      [rows] = await pool.query<PostModel[]>(
        `SELECT ticket.*, user.full_name as submitted_by
         FROM ticket
         JOIN user ON ticket.user_id = user.id
         ORDER BY ticket.create_time DESC`
      );
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
    const [rows] = await pool.query<PostModel[]>(
      `SELECT ticket.*, user.full_name as submitted_by
       FROM ticket
       JOIN user ON ticket.user_id = user.id
       WHERE ticket.id = ?`, [id]
    );
    const data = rows[0];
    if (data) return context.json(data, 200);
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
      const [data] = await pool.query<PostModel[]>(
        `SELECT ticket.*, user.full_name as submitted_by
         FROM ticket
         JOIN user ON ticket.user_id = user.id
         WHERE ticket.id = ?`, [result.insertId]
      );
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

export async function updateTicketStatus(context: Context) {
  try {
    const id = context.req.param('id');
    const body = await context.req.json();

    if (!body.status) return context.json({ message: "Status is required" }, 400);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE ticket SET status = ? WHERE id = ?`,
      [body.status, id]
    );

    if (result.affectedRows > 0) {
      return context.json({ message: "Status updated successfully" }, 200);
    }

    return context.json({ message: "Ticket not found" }, 404);
  } catch (error) {
    console.log(error);
    return context.json({ message: "Internal server error" }, 500);
  }
}

export async function updatePost(context: Context) {
  try {
    const id = context.req.param('id');
    const body: UpdatePostModel = await context.req.json();

    if (!body.title) return context.json({ message: "Title is required" }, 400);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE ticket SET title = ?, type_of_report = ?, category = ?, description = ? WHERE id = ?`,
      [body.title, body.type_of_report, body.category, body.description, id]
    );

    if (result.affectedRows > 0) {
      const [data] = await pool.query<PostModel[]>(
        `SELECT ticket.*, user.full_name as submitted_by
         FROM ticket JOIN user ON ticket.user_id = user.id
         WHERE ticket.id = ?`, [id]
      );
      return context.json(data[0], 200);
    }

    return context.json({ message: "Ticket not found" }, 404);
  } catch (error) {
    console.log(error);
    return context.json({ message: "Internal server error" }, 500);
  }
}