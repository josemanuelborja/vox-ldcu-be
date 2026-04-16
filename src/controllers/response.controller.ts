import type { Context } from "hono";
import pool from "../config/db.js";
import type { ResponseModel, CreateResponseModel, UpdateResponseModel } from "../models/response.model.js";
import type { ResultSetHeader } from "mysql2";

export async function getResponses(context: Context) {
  try {
    const ticket_id = context.req.param('ticket_id');
    const [rows] = await pool.query<ResponseModel[]>(
      `SELECT * FROM ticket_response WHERE ticket_id = ? ORDER BY created_at ASC`,
      [ticket_id]
    );
    return context.json(rows, 200);
  } catch (error) {
    console.log(error);
    return context.json({ message: 'Internal server error' }, 500);
  }
}

// POST new response
export async function createResponse(context: Context) {
  try {
    const body: CreateResponseModel = await context.req.json();

    if (!body.ticket_id) return context.json({ message: "Ticket ID is required" }, 400);
    if (!body.message) return context.json({ message: "Message is required" }, 400);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO ticket_response (ticket_id, name, message) VALUES (?, ?, ?)`,
      [body.ticket_id, body.name || 'Admin', body.message]
    );

    if (result.insertId) {
      const [data] = await pool.query<ResponseModel[]>(
        `SELECT * FROM ticket_response WHERE id = ?`, [result.insertId]
      );
      return context.json(data[0], 201);
    }

    return context.json({ message: "Failed to create response" }, 400);
  } catch (error) {
    console.log(error);
    return context.json({ message: "Internal server error" }, 500);
  }
}

// DELETE response
export async function deleteResponse(context: Context) {
  try {
    const id = context.req.param('id');
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM ticket_response WHERE id = ?`, [id]
       

    );

    if (result.affectedRows > 0) {
      return context.json({ message: "Response deleted successfully" }, 200);
    }

    return context.json({ message: "Response not found" }, 404);
  } catch (error) {
    console.log(error);
    return context.json({ message: "Internal server error" }, 500);
  }
}

export async function updateResponse(context: Context) {
  try {
    const id = context.req.param('id');
    const body: UpdateResponseModel = await context.req.json();

    if (!body.message) return context.json({ message: "Message is required" }, 400);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE ticket_response SET message = ?, is_edited = 1 WHERE id = ?`,
      [body.message, id]
    );

    if (result.affectedRows > 0) {
      const [data] = await pool.query<ResponseModel[]>(
        `SELECT * FROM ticket_response WHERE id = ?`, [id]
      );
      return context.json(data[0], 200);
    }

    return context.json({ message: "Response not found" }, 404);
  } catch (error) {
    console.log(error);
    return context.json({ message: "Internal server error" }, 500);
  }
}