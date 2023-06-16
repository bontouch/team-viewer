//fetch avatars after 00:30, Because we do new batch job att 00:00. Also fetch if not fetched yet
const shouldFetchAvatars = (avatarsLastFetchedDate) => {
  if (!avatarsLastFetchedDate) return true;
  const lastPredictedBatchFetchDate = new Date();
  lastPredictedBatchFetchDate.setHours(0);
  lastPredictedBatchFetchDate.setMinutes(30);
  lastPredictedBatchFetchDate.setSeconds(0);

  return lastPredictedBatchFetchDate - avatarsLastFetchedDate > 0;
};

module.exports = shouldFetchAvatars;
