import { Hono } from "hono";
import { getResponses, createResponse, deleteResponse } from "../controllers/response.controller.js";

const responseRoute = new Hono();

responseRoute.get('/:ticket_id', getResponses);
responseRoute.post('/', createResponse);
responseRoute.delete('/:id', deleteResponse);

export default responseRoute;