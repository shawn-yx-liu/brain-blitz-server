import fetch from 'node-fetch';
import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from "cors";
import { nanoid } from 'nanoid';
import { decode } from 'html-entities';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: {
    origin: "https://brain-blitz-shawnliu.netlify.app",
    credentials: true
  } });

let games = {};

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('host', () => {
    // generate gameId
    const gameId = generateRandomCode(4);
    games[gameId] = [{playerId: socket.id, score: null}];
    io.emit("newGame", {playerId: socket.id, gameId});
  })

  socket.on('join', (gameId) => {
    if (!games[gameId] || games[gameId].length < 1) {
      io.emit("error", {playerId: socket.id, message: "Invalid ID"});
    } else if (games[gameId].length >= 2) {
      io.emit("error", {playerId: socket.id, message: "Lobby is already full"});
    } else {
      games[gameId].push({playerId: socket.id, score: null});
      io.emit("joinedGame", gameId);
    }
  })

  socket.on('startGame', (gameId) => {
    if (!games[gameId] || games[gameId].length !== 2) {
      io.emit("error", {playerId: socket.id, message: "Not enough players in lobby"});
      return;
    }

    getQuestions(gameId, socket.id);
  })

  socket.on('startSoloGame', () => {
    const gameId = generateRandomCode(4);
    io.emit("newGame", {playerId: socket.id, gameId});

    getQuestions(gameId, socket.id);
  })

  // Listen for score updates from clients
  socket.on('updateScore', (data) => {
    // Update the score for the incoming player and broadcast it to all connected clients
    const {gameId, score} = data;
    const players = games[gameId];

    if (players[0].playerId === socket.id) {
      players[0].score = score;
    } else {
      players[1].score = score;
    }

    // check if both players have submitted their score
    if (typeof(players[0].score) === "number" && typeof(players[1].score) === "number") {
        // emit the scores
        io.emit("scores", games[gameId]);
        // clear the players object for the next round
        delete games[gameId];
    }
  });

  // Clean up when a user disconnects
  socket.on('disconnect', () => {
    console.log("User disconnected");
    Object.keys(games).forEach(gameId => {
      if (games[gameId].some(player => player.playerId === socket.id)) {
        delete games[gameId];
      }
    })
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function generateRandomCode(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let counter = 0; counter < length; counter++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function getQuestions(gameId, socketId) {
  fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(response => response.json())
    .then(data => {
        const questions = data.results.map(item => {
            // Condense the answers into one array and add an ID
            const mappedItem = {
                id: nanoid(),
                question: decode(item.question),
                answers: item.incorrect_answers.map(answer => decode(answer)),
                correctAnswer: decode(item.correct_answer),
                selectedAnswer: ""
            }

            const randomIndex = Math.floor(Math.random() * 4); // index to insert the correct answer
            mappedItem.answers.splice(randomIndex, 0, mappedItem.correctAnswer)
            return mappedItem
        })

        io.emit('questions', {gameId, questions});
    }
  ).catch(_ => io.emit('error', {playerId: socketId, message: `Error while retrieving questions. Please try again.`}));
}
