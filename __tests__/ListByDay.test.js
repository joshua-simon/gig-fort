import ListByDay from "../components/ListByDay";
import { render } from '@testing-library/react-native'
import "@testing-library/jest-dom/extend-expect"
import { format } from 'date-fns'
import { getGigsToday } from '../util/helperFunctions'

test("should render listByDay", () => {
  const { getByTestId } = render(<ListByDay />);
  const header = getByTestId("header");
  expect(header).toBeTruthy();
});

test("that getGigsToday filters gigs correctly", () => {
  const currentDate = new Date("2023-01-01"); //1672531200000

  const gigs = [
    { dateAndTime: { seconds: 1609459200 } },
    { dateAndTime: { seconds: 1672531200 } },
    { dateAndTime: { seconds: 1609632000 } },
  ];

  const gigsToday = getGigsToday(gigs, currentDate);

  expect(gigsToday).toEqual([{ dateAndTime: { seconds: 1672531200 } }]);
});

test("that getGigsThisWeek returns gigs in correct format", () => {
  
})

