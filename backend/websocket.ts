import { Client } from "pg";
import { loadStatsFromDatabase } from "./db.ts";
import { ExtWebSocket } from "./server.ts";
import type { Stats } from "./types.ts";

let oldStats: Stats;
let oldClients: WebSocket[];
export async function broadcastData(clients: WebSocket[], dbclient: Client) {
    // If no one is connected, don't query the database
    if (clients.length == 0) return;

    const stats = await loadStatsFromDatabase(dbclient);

    // only send Data if Data has changed and the same clients are connected
    if (JSON.stringify(oldStats) === JSON.stringify(stats) && clients == oldClients) return;

    clients.forEach((client) => {
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
