export type Stats = {
    totals: Totals
    ids: {
        [index: string]: User;
    }
}

export type Totals = {
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

export type AccessListEntry = {
    "date": number,
    "token": string
}