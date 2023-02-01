import GigsByDay from "../components/GigsByDay";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";

describe("gigs by week component", () => {
  let navigation;

  beforeEach(() => {
    navigation = { navigate: jest.fn() };
  });

  const gigsFromSelectedDate = [
    {
      venue: "The Venue",
      gigName: "The Gig",
      blurb: "The Blurb",
      isFree: false,
      image: "The Image",
      genre: "The Genre",
      dateAndTime: { seconds: 1675228470.894 },
      tickets: "",
      id: "123",
    },
  ];

  test("that when gig listing is pressed on it redirects user to Gig Details page", async () => {
    render(
      <GigsByDay
        gigsFromSelectedDate={gigsFromSelectedDate}
        navigation={navigation}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId("gigs-today-card")).toBeTruthy();
    });
    const gigCard = screen.getByTestId("gigs-today-card");
    fireEvent.press(gigCard);
    expect(navigation.navigate).toHaveBeenCalledWith("GigDetails", {
      venue: "The Venue",
      gigName: "The Gig",
      blurb: "The Blurb",
      isFree: false,
      image: "The Image",
      genre: "The Genre",
      dateAndTime: { seconds: 1675228470.894 },
      tickets: "",
      id: "123",
    });
  });
});
