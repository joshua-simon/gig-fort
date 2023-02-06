import { format } from "date-fns";

test(" that correct date is beign shown", () => {
    const dateAndTime = { nanoseconds: 0, seconds: 1612573600 };
    const expectedDate = 'Sat Feb 6th 2021';
    const date = format(new Date(dateAndTime.seconds * 1000), 'EEE LLL do Y');
  
    expect(date).toBe(expectedDate);
})