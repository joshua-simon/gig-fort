import * as React from 'react'
import { render,screen,fireEvent } from '@testing-library/react-native'
import Map from '../screens/Map';
import { format } from "date-fns";

  test("that map header displays current date", () => {
    const currentDate = format(new Date(Date.now()),'EEE LLL do Y')
    const headerContent = `Gigs on ${currentDate}`
    render(<Map/>)
    const header = screen.getByText(headerContent)
    expect(header).toBeDefined()
  })