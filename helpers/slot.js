const { time2Minutes } = require("./time")
const { LESSON_PERIODS, SESSION_PERIODS } = require("@/src/config/constants")

const getPeriod = (minutes) => {
    const period = LESSON_PERIODS.find(p => {
        const start = time2Minutes(p.start);
        const end = time2Minutes(p.end);
        return minutes >= start && minutes <= end;
    });
    return period ? period.period : null;
}

const forSession = (now) => {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const current = SESSION_PERIODS.find(session => {
        const start = time2Minutes(session[0].start);
        const end = time2Minutes(session.at(-1).end);
        return nowMinutes >= start && nowMinutes <= end;
    });
    if (current) return current;
    return SESSION_PERIODS.find(session => nowMinutes < time2Minutes(session[0].start)) || [];
};



module.exports = {
    getPeriod,
    forSession
};