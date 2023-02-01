import Map from '../screens/Map';
import GigMap from '../components/GigMap';
import * as React from 'react'
import { render,screen,fireEvent,waitFor, act } from '@testing-library/react-native'
import renderer from 'react-test-renderer'
import { format } from 'date-fns';

describe("Map component", () => {
  let navigation;

  beforeEach(() => {
    navigation = { navigate: jest.fn() };
  });

  test("should navigate to the List screen when the button is pressed", async () => {
    render(<Map navigation={navigation} />)
    const button = screen.getByText("List View")
    fireEvent.press(button);
    expect(navigation.navigate).toHaveBeenCalledWith("List");
  });

  // test("that UI stays consistent", async () => {
  //    act(async () => {
  //     const tree = await renderer.create(<Map />).toJSON();
  //     expect(tree).toMatchSnapshot();
  //   })
  // });

  test("that map header displays current date", () => {
    const currentDate = format(new Date(Date.now()),'EEE LLL do Y')
    const headerContent = `Gigs on ${currentDate}`
    render(<Map/>)
    const header = screen.getByText(headerContent)
    expect(header).toBeDefined()
  })

});