async function getValueFromUserId(db, key, userId) {
    return (await db.query(`SELECT "${key}" FROM users WHERE "UserId" = ${userId}`)).rows[0];
}
async function updateValueFromUserId(db, value, newValue, userId) {
    return (await db.query(`UPDATE users SET "${value}" = "${newValue}" WHERE "UserId" = ${userId}`));
}

async function incrementValueFromUserId(db, value, int, userId) {
    return (await db.query(`UPDATE users SET "${value}" = "${value}" + ${int} WHERE "UserId" = ${userId}`));
}

module.exports = {
    getValueFromUserId, updateValueFromUserId, incrementValueFromUserId
};