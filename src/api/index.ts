import { Router } from "express";
import { pingRoute } from "./ping";

const router = Router();

router.all("/ping", pingRoute);

export default router;
