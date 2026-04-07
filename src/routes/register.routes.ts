import { Hono } from "hono";
import { register, login, resetPassword, checkEmail} from "../controllers/register.controller.js";

const router = new Hono();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/check-email", checkEmail);

export default router;