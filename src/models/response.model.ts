import type { RowDataPacket } from "mysql2";

export interface ResponseModel extends RowDataPacket {
  id: number;
  ticket_id: number;
  admin_name: string;
  message: string;
  created_at: Date;
}

export interface CreateResponseModel {
  ticket_id: number;
  admin_name: string;
  message: string;
}

export interface UpdateResponseModel {
  message: string;
}