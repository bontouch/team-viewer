//fetch new hibob data every 4 hours or if not fetched
const shouldFetchTeams = (teamsLastFetchedDate) => {
  if (!teamsLastFetchedDate) return true;

  const currTime = new Date();

  currTime.setHours(currTime.getUTCHours() + 2);

  const latestFetchHour = currTime.getHours() - (currTime.getHours() % 4);

  currTime.setHours(latestFetchHour);
  currTime.setMinutes(0);
  currTime.setSeconds(0);

  return teamsLastFetchedDate - currTime < 0;
};

module.exports = shouldFetchTeams;
