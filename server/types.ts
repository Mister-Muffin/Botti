export type Status = {
    totals: Totals
    ids: {
        [index: string]: User;
    }
}

type Totals = {
    "Alla"?: number,
    "Ehre"?: number,
    "Yeet"?: number,
    "Schaufel"?: number,
    "Xp"?: number,
    "Messages"?: number
}

export type User = {
    "UserId"?: number,
    "Alla"?: number,
    "Ehre"?: number,
    "Yeet"?: number,
    "Schaufel"?: number,
    "Username"?: string,
    "Xp"?: number,
    "Messages"?: number
}