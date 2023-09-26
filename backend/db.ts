import { Client } from "pg";
import type { User, Totals, Stats } from "./types.ts";

export async function loadStatsFromDatabase(dbclient: Client) {
    const query = await dbclient.query("SELECT \"UserId\", \"Alla\", \"Ehre\", \"Yeet\", \"Schaufel\", \"Username\", \"Xp\", \"Messages\" FROM users");

    const status: Stats = {
        totals: {},
        ids: {}
    };

    for (const key in query.rows[0]) {
        // Only sum up if it makes sense to sum. (Do not sum user ids/names)
        if (["Alla", "Ehre", "Yeet", "Schaufel", "Xp", "Messages"].includes(key))
            status.totals[key as keyof Totals] = Number(query.rows.reduce((accumulator, item) => {
                return Number(accumulator) + Number(item[key]);
            }, 0));
    }

    for (let i = 0; i < query.rows.length; i++) {
        const userId: string | unknown = query.rows[i].UserId;
        if (userId != null) {
            try {
                status.ids[userId as keyof User] = query.rows[i];
                status.ids[userId as keyof User].Xp = Number(status.ids[userId as keyof User].Xp);
                status.ids[userId as keyof User].UserId = Number(status.ids[userId as keyof User]);
                status.ids[userId as keyof User].Messages = Number(status.ids[userId as keyof User].Messages);
            } catch { /**/ }
        }
    }

    return status;
}