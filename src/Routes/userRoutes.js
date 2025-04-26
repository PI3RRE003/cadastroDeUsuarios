import { Router } from "express";
import { UserController } from "../controller/UserController.js";

const router = Router()

router.post('/usuarios', UserController.post)
router.get('/usuarios', UserController.get)
router.get('/usuarios/:id', UserController.findUnique)
router.put('/usuarios/:id', UserController.put)
router.delete('/usuarios/:id', UserController.delete)

export default router
