

const date2DateTime = (date) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}


const dateTime2Date = (dateTime) => {
  const day = String(dateTime.getDate()).padStart(2, '0');
  const month = String(dateTime.getMonth() + 1).padStart(2, '0');
  const year = dateTime.getFullYear();
  return `${year}-${month}-${day}`;

}

const getNowDate = () => {
  const dateTime = new Date()
  const day = String(dateTime.getDate()).padStart(2, '0');
  const month = String(dateTime.getMonth() + 1).padStart(2, '0');
  const year = dateTime.getFullYear();
  return `${year}-${month}-${day}`;
}

const getNowDateTime = () => {
  return new Date(Date.now() + 7 * 60 * 60 * 1000);
}

function getWeekNumber(dateTime) {
  const currentDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
  currentDate.setDate(currentDate.getDate() + 4 - (currentDate.getDay() || 7));
  const yearStart = new Date(currentDate.getFullYear(), 0, 1);
  return Math.ceil((((currentDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getWeekRange(dateStr) {
  const date = date2DateTime(dateStr)
  let dayOfWeek = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dayOfWeek - 1));
  const sunday = new Date(date);
  sunday.setDate(monday.getDate() + 6);
  return {
    startOfWeek: dateTime2Date(monday),
    endOfWeek: dateTime2Date(sunday)
  };
}

function getWeekRangeFromDate(date) {
  const day = date.getDay() || 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - (day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday, sunday };
}

function dateTime2dayOfWeek(date) {
  return date.getDay() || 7;
}
function addWeeks(date, weeks) {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function generateMissingWeeks(base = []) {
  const rs = [];
  const now = getNowDateTime()
  const future = base.filter(e => e.s > now);
  let dup = false;
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(i => {
    const nextWeek = addWeeks(now, i)
    const looked = future.find(f => f.s <= nextWeek && nextWeek <= f.e)
    const { monday: s, sunday: e } = getWeekRangeFromDate(nextWeek)
    !looked && rs.push({ s, e })
  })
  return rs
}


module.exports = {
  date2DateTime,
  dateTime2Date,
  getWeekNumber,
  getWeekRange,
  generateMissingWeeks,
  dateTime2dayOfWeek,
  getNowDate,
  getNowDateTime
};
