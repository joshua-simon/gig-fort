import * as React from 'react'
import { render,screen,fireEvent } from '@testing-library/react-native'
import Map from '../screens/Map';

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

});