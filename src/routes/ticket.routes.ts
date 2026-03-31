import { Hono } from "hono";
import { createPost, deletePostById, getAllPosts, getPostById } from "../controllers/ticket.controller.js";

const postsRoute = new Hono();

postsRoute.get('/', getAllPosts);
postsRoute.get('/:id', getPostById);
postsRoute.post('/', createPost);
postsRoute.delete('/:id', deletePostById)

export default postsRoute;