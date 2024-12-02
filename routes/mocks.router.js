const { Router } = require("express");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const Pet = require("../models/pet.model");

const router = Router();

// Ruta base de prueba
router.get("/", (req, res) => {
    res.send("Bienvenido a la API de Mocks");
});

// Endpoint para generar mascotas ficticias
router.get("/mockingpets", (req, res) => {
    const pets = [];
    for (let i = 0; i < 10; i++) {
        pets.push({
            id: faker.database.mongodbObjectId(),
            name: faker.animal.type(),
            age: faker.number.int({ min: 1, max: 15 }),
            breed: faker.animal.dog(),
        });
    }
    res.json({ pets });
});

// Endpoint para generar usuarios ficticios
router.get("/mockingusers", async (req, res) => {
    const users = [];
    const roles = ["user", "admin"];

    for (let i = 0; i < 50; i++) {
        const password = await bcrypt.hash("coder123", 10); // Encripta la contraseña

        users.push({
            id: faker.database.mongodbObjectId(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: password, // Contraseña encriptada
            role: roles[i % 2], // Alterna entre "user" y "admin"
            pets: [], // Array vacío
        });
    }

    res.json({ users });
});

// Endpoint para generar e insertar datos en la base de datos
router.post("/generateData", async (req, res) => {
    const { users, pets } = req.body;

    if (!users || !pets) {
        return res.status(400).json({ error: "Se requieren los parámetros 'users' y 'pets'" });
    }

    const generatedUsers = [];
    const generatedPets = [];

    try {
        // Generar mascotas
        for (let i = 0; i < pets; i++) {
            const newPet = await Pet.create({
                name: faker.animal.type(),
                age: faker.number.int({ min: 1, max: 15 }),
                breed: faker.animal.dog(),
            });
            generatedPets.push(newPet._id);
        }

        // Generar usuarios
        const roles = ["user", "admin"];
        for (let i = 0; i < users; i++) {
            const password = await bcrypt.hash("coder123", 10);

            const newUser = await User.create({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: password,
                role: roles[i % 2],
                pets: generatedPets.slice(0, faker.number.int({ min: 0, max: pets })),
            });

            generatedUsers.push(newUser);
        }

        res.status(201).json({ users: generatedUsers, pets: generatedPets });
    } catch (error) {
        console.error("Error generando datos:", error);
        res.status(500).json({ error: "Error generando datos" });
    }
});

module.exports = router;
