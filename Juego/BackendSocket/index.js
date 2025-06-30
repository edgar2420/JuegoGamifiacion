const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const db = require("./models");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST", "PUT"] }
});

// Guardar `io` globalmente para usarlo en controladores
app.set("io", io);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = { origin: 'http://localhost:5173' };
app.use(cors(corsOptions));

app.use(express.static('public'));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// Sincronizar base de datos
db.sequelize.sync().then(() => {
  console.log("Base de datos sincronizada");
});

// Importar rutas
require('./routes')(app, io);

// Middleware de errores de JSON
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    res.status(400).json({ msg: 'Error en el JSON' });
  } else {
    next();
  }
});

// Socket.IO: conexión básica
io.on("connection", (socket) => {
  console.log("Cliente conectado vía Socket.IO");

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
