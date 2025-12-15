const SESSION_PERIODS = [
  [
    { period: 1, start: "07:00", end: "07:45" },
    { period: 2, start: "08:00", end: "08:45" },
    { period: 3, start: "09:00", end: "09:45" },
    { period: 4, start: "10:00", end: "10:45" },
    { period: 5, start: "11:00", end: "11:45" }
  ],
  [
    { period: 6, start: "13:00", end: "13:45" },
    { period: 7, start: "14:00", end: "14:45" },
    { period: 8, start: "15:00", end: "15:45" },
    { period: 9, start: "16:00", end: "16:45" }
  ]
];

const LESSON_PERIODS = SESSION_PERIODS.flat();

const AI_BASE_URL = process.env.AI_BASE_URL

const AI_ENDPOINTS = {
  REGISTER: AI_BASE_URL + "/register",
  RECOGNIZE: AI_BASE_URL + "/recognize",
}

const TIME_RULE = {
  LATE: 5,
  EARLY: -45

}
module.exports = {
  LESSON_PERIODS,
  SESSION_PERIODS,
  AI_ENDPOINTS,
  TIME_RULE
};