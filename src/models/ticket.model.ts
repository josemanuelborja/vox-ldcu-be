import type { RowDataPacket } from "mysql2";

export interface PostModel extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  type_of_report: 'complain' | 'suggestion';
  category: 'facilities' | 'faculty' | 'administration' | 'others';
  description: string;
  attachment: string | null;
  status: 'submitted' | 'in_progress' | 'resolved' | 'closed';
  create_time: Date;
}

export interface CreatePostModel {
  user_id: number;
  title: string;
  type_of_report: 'complain' | 'suggestion';
  category: 'facilities' | 'faculty' | 'administration' | 'others';
  description: string;
  attachment?: string | null; 
}

export interface UpdatePostModel {
  title: string;
  type_of_report: 'complain' | 'suggestion';
  category: 'facilities' | 'faculty' | 'administration' | 'others';
  description: string;
}