import ListByDay from "../components/ListByDay";
import { render,fireEvent,screen } from '@testing-library/react-native'
import "@testing-library/jest-dom/extend-expect"
import { getGigsToday,getGigsThisWeek } from '../util/helperFunctions'


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
  const date1 = new Date("2023-01-25T22:50:30").getTime() / 1000;
  const date2 = new Date("2023-01-26T21:50:30").getTime() / 1000;
  const date3 = new Date("2023-01-27T20:50:30").getTime() / 1000;

  const gigs = [
    { dateAndTime: { seconds: date1 } },
    { dateAndTime: { seconds: date2 } },
    { dateAndTime: { seconds: date3 } },
  ];

  const date = new Date("2023-01-26T21:50:30")

  const gigsThisWeek = getGigsThisWeek(gigs, date);

  expect(gigsThisWeek).toEqual({
    "Thu Jan 26th 2023": [
      {
        dateAndTime: { seconds: 1674723030 },
        titleDate: "Thu Jan 26th 2023",
      },
    ],
    "Fri Jan 27th 2023": [
      {
        dateAndTime: { seconds: 1674805830 },
        titleDate: "Fri Jan 27th 2023",
      },
    ],
  });
});


test("that 'showWeek' state is switched to false when 'Gigs Today' pressed", () => {
  render(<ListByDay />);
  const gigsToday = screen.getByTestId("gigs-today")
  fireEvent.press(screen.getByTestId("gigsTodayButton"))
  expect(gigsToday).not.toBeNull()
})

