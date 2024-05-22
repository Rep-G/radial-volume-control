import express from "express";
import http from "http";
import { Server } from "socket.io";
import loudness from "loudness";
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 2750;
app.use(express.static('public'));
async function getSystemVolume() {
  try {
    const volume = await loudness.getVolume();
    return volume;
  } catch (error) {
    console.error('Error getting system volume:', error);
    return null;
  }
}
async function sendSystemVolume() {
  try {
    const volume = await getSystemVolume();
    if (volume !== null) {
      io.emit('volume', volume);
    }
  } catch (error) {
    console.error('Error sending system volume:', error);
  }
}
setInterval(sendSystemVolume, 100);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});