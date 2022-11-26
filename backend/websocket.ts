import { Client } from "pg";
import { WebSocket, WebSocketServer } from "ws";
import { loadStatsFromDatabase } from "./db.js";
import { ExtWebSocket } from "./server.js";
import { Stats } from "./types";

let oldStats: Stats;
export async function broadcastData(wss: WebSocketServer, dbclient: Client) {
    // If no one is connected, don't query the database
    if (wss.clients.size == 0) return;

    const stats = await loadStatsFromDatabase(dbclient);

    // only send Data if Data has changed
    if (JSON.stringify(oldStats) === JSON.stringify(stats)) return;

    wss.clients.forEach(client => {
        client.send(JSON.stringify(stats));
    });

    oldStats = stats;
    return;
}

export function terminateDeadConnections(wss: WebSocketServer) {
    wss.clients.forEach((ws: WebSocket) => {
        const extWs = ws as ExtWebSocket;

        if (!extWs.isAlive) return ws.terminate();

        extWs.isAlive = false;
        extWs.ping();
    });
    return;
}
