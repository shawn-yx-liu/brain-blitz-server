const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, { cors: {
    origin: "http://localhost:5500",
    credentials: true
  } });

let players = [];

io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for score updates from clients
  socket.on('updateScore', (score) => {
    // Update the score for the incoming player and broadcast it to all connected clients
    players.push({player: socket.id, score: score});
    console.log('players: ', players)

    // check if both players have submitted thier score
    if (players.length === 2) {
        // Determine the game result
        const player1Score = players[0].score;
        const player2Score = players[1].score;

        let result = null;
        if (player1Score === player2Score) {
            result = "It's a tie!";
        } else if (player1Score > player2Score) {
            result = "Player 1 wins!";
        } else {
            result = "Player 2 wins!";
        }

        // emit the scores
        io.emit("scores", players);
        // clear the players object for the next round
        players = [];
    }
  });

  // Clean up when a user disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected');
    delete players[socket.id];
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
