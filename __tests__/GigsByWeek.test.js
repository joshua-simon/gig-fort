import GigsByWeek from "../components/GigsByWeek";
import {
    render,
    screen,
    fireEvent,
    waitFor
  } from "@testing-library/react-native";


  describe("gigs by week component", () => {
    let navigation;
  
    beforeEach(() => {
      navigation = { navigate: jest.fn() };
    });
  
    const gigsThisWeek_grouped = {
      "Fri Feb 3rd 2023": [
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
          location: {
            latitude: -41.29342516194285,
            longitude: 174.77451072494182,
          },
        },
      ],
    };
  
    test("that when gig listing is pressed on it redirects user to Gig Details page", async () => {
      render(
        <GigsByWeek
            gigsThisWeek_grouped={gigsThisWeek_grouped}
            navigation={navigation}
        />
      );
      await waitFor(() => {
        expect(screen.getByTestId("gigs-week-card")).toBeTruthy();
      });
      const gigCard = screen.getByTestId("gigs-week-card");
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