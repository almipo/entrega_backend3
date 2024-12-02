// index.js
const express = require("express");
const mongoose = require("mongoose");
const mocksRouter = require("./routes/mocks.router");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/tuBaseDeDatos");

// Ruta base de prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

// Conexión al servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use("/api/mocks", mocksRouter);