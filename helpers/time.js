const time2Minutes = (timeStr) => {
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 60 + m;
}
const minutes2Time = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const getMinutesNow = ()=>{
  const dateTime = new Date()
  return dateTime.getHours() * 60 + dateTime.getMinutes();
}

module.exports = {
  time2Minutes,
  minutes2Time,
  getMinutesNow

};
