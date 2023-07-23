import { format, addDays } from "date-fns";

export const getGigsToday = (gigArray: any, currentDate: number) => {
  const currentDayInSecs = currentDate / 1000;
  const startOfDay = Math.floor(currentDayInSecs / 86400) * 86400;
  const endOfDay = startOfDay + 86399;

  return gigArray.filter((gig) =>
    gig.dateAndTime.seconds >= startOfDay &&
    gig.dateAndTime.seconds <= endOfDay
  );
};

export const getGigsThisWeek = (gigArray: any, currentDate: number) => {
  const currentSec = currentDate / 1000;
  const weekFromNowSec = currentSec + 7 * 86400; // 7 days * 24 hours * 60 mins * 60 secs

  const gigsThisWeek = gigArray
    .filter((gig) => gig.dateAndTime.seconds >= currentSec && gig.dateAndTime.seconds < weekFromNowSec)
    .sort((a, b) => a.dateAndTime.seconds - b.dateAndTime.seconds)
    .map((item) => {
      const formattedDate = format(new Date(item.dateAndTime.seconds * 1000), "EEE LLL do Y");
      return { ...item, titleDate: formattedDate };
    });

  const gigsThisWeekGrouped = gigsThisWeek.reduce((acc, curr) => {
    if (acc[curr.titleDate]) {
      acc[curr.titleDate].push(curr);
    } else {
      acc[curr.titleDate] = [curr];
    }
    return acc;
  }, {});

  return gigsThisWeekGrouped;
};







