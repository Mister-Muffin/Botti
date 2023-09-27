import { Client } from "pg";
import { loadStatsFromDatabase } from "./db.ts";
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
    oldClients = clients;
    return;
}
