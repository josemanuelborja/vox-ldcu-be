import { Hono } from "hono";
import { createPost, deletePostById, getAllPosts, getPostById, updatePost, updateTicketStatus } from "../controllers/ticket.controller.js";

const postsRoute = new Hono();

postsRoute.get('/', getAllPosts);
postsRoute.get('/:id', getPostById);
postsRoute.post('/', createPost);
postsRoute.delete('/:id', deletePostById)
postsRoute.patch('/:id/status', updateTicketStatus); 
postsRoute.put('/:id', updatePost);

export default postsRoute;