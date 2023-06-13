const getMaxAge = () => {
  const currDate = new Date();
  currDate.setHours(currDate.getUTCHours() + 2);
  const nextDate = new Date(
    currDate.getFullYear(),
    currDate.getMonth(),
    currDate.getDate(),
    0,
    30,
    0
  );
  if (nextDate - currDate < 0) nextDate.setDate(currDate.getDate() + 1);

  return Math.ceil((nextDate - currDate) / 1000);
};

module.exports = getMaxAge;
