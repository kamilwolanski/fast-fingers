## 🚀 Getting Started

```bash
# Clone the repository

# Install dependencies
npm install

# Start the development server
npm run dev
```


# Multiplayer Game – Server-Synchronized Gameplay

This project is a **multiplayer game** where the game state is **shared and managed on the server side**.  
All players see the same round progress in real time, while the server controls the game lifecycle — including **round start, end, and next round scheduling**.

---

## Game State Management – `GameManager` Class

The entire game logic is encapsulated in an **object-oriented** class called `GameManager`.  
This class is responsible for maintaining and updating the **global game state**, including:

- List of active players  
- Current sentence  
- Round timer  
- Scores and results  
- Game lifecycle (start/end/reset)

It also provides methods for:

- Adding new players  
- Updating player scores and progress  
- Starting and ending rounds  
- Cleaning up inactive players  

---

## Client ↔ Server Communication (Polling)

The frontend periodically communicates with the backend using **polling**.  
It regularly fetches the current game state from the `/api/game` endpoint and sends player progress updates at fixed intervals.

While **WebSockets** would be a more efficient and scalable solution (for instant updates), polling was chosen for this **MVP** due to limited time and experience with real-time socket implementations.

---

## REST API Endpoints

The server exposes a minimal **REST API** for communication between the frontend and backend

---

## Client-Side State

Each player’s **ID** and **name** are stored in `localStorage`, so returning users are automatically recognized.  
The client periodically:

- Fetches the latest game state from the server  
- Sends updates (accuracy, typed text, finished state) via `PATCH` requests  

---

## Server-Controlled Rounds

The `GameManager` class handles the entire **round lifecycle**, including:

- `DURATION_MS` – duration of each round  
- `NEXT_ROUND_DURATION_MS` – delay before the next round starts  
- `SENTENCES` – dataset of randomized sentences for each round  
- Automatic result reset after each round  

---

## Inactive Player Cleanup

Players who do not send updates for a defined period (`PLAYER_TIMEOUT_MS`) are automatically **removed** from the active players list.  
This ensures that only active participants remain in the session and keeps the game state clean.



