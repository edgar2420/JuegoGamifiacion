import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("🔌 Socket conectado");
});

socket.on("disconnect", () => {
  console.log("❌ Socket desconectado");
});

export default socket;