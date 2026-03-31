import type { RowDataPacket } from "mysql2";

export interface UserModel extends RowDataPacket {
  id: number;
  full_name: string;
  student_id: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface RegisterModel {
  full_name: string;
  student_id: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginModel {
  email: string;
  password: string;
}