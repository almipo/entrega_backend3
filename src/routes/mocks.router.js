import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

// Mocking endpoints
router.get("/mockingUsers", mocksController.getUsuarios); 
router.get("/mockingPets", mocksController.getMascotas); 

// Base de datos
router.get("/users", mocksController.getUsersFromDB);
router.get("/pets", mocksController.getPetsFromDB);

// Generar datos en la base de datos
router.post("/generateData", mocksController.generateData);

export default router;
