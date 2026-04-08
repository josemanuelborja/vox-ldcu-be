import { Hono } from "hono";
import { getResponses, createResponse, deleteResponse, updateResponse} from "../controllers/response.controller.js";

const responseRoute = new Hono();

responseRoute.get('/:ticket_id', getResponses);
responseRoute.post('/', createResponse);
responseRoute.put('/:id', updateResponse); 
responseRoute.delete('/:id', deleteResponse);

export default responseRoute;