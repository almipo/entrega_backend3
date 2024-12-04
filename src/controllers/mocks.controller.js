import MockingService from "../services/mocking.js";
import User from "../dao/models/User.js";
import Pet from "../dao/models/Pet.js";
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const getMascotas = async (req, res) => {
    try {
        const mascotas = await MockingService.generarMockingMascotas(100);
        res.send({ status: "success", payload: mascotas });
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo las mascotas" });
    }
};

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await MockingService.generarMockingUsuario(50);
        res.send({ status: "success", payload: usuarios });
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo los usuarios" });
    }
};

// Lógica para generar datos
const generateData = async (req, res) => {
    const { users, pets } = req.body;

    if (!users || !pets) {
        return res.status(400).json({ error: "Se requieren los parámetros 'users' y 'pets'" });
    }

    const generatedUsers = [];
    const generatedPets = [];

    try {
        // Generación de mascotas
        for (let i = 0; i < pets; i++) {
            const newPet = await Pet.create({
                name: faker.animal.dog(),
                specie: faker.animal.type(),
                birthDate: faker.date.past(5),
                adopted: faker.datatype.boolean(),
            });
            generatedPets.push(newPet);
        }

        // Generación de usuarios
        const roles = ["user", "admin"];
        for (let i = 0; i < users; i++) {
            const password = await bcrypt.hash("coder123", 10);

            const newUser = await User.create({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: password,
                role: roles[i % 2],
                pets:[]
            });

            generatedUsers.push(newUser);
        }

        res.status(201).json({ users: generatedUsers, pets: generatedPets });
    } catch (error) {
        console.error("Error generando datos:", error);
        res.status(500).json({ error: "Error generando datos" });
    }
};

const getUsersFromDB = async (req, res) => {
    try {
        const usuarios = await User.find(); 
        res.status(200).json({ status: "success", payload: usuarios });
    } catch (error) {
        console.error("Error obteniendo usuarios desde MongoDB:", error);
        res.status(500).json({ error: "Error obteniendo usuarios desde MongoDB" });
    }
};

const getPetsFromDB = async (req, res) => {
    try {
        const mascotas = await Pet.find();
        res.status(200).json({ status: "success", payload: mascotas });
    } catch (error) {
        console.error("Error obteniendo mascotas desde MongoDB:", error);
        res.status(500).json({ error: "Error obteniendo mascotas desde MongoDB" });
    }
};
export default {
    getMascotas,
    getUsuarios,
    generateData,   
    getUsersFromDB,
    getPetsFromDB
}
