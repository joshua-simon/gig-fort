import ListByDay from "../components/ListByDay";
import { render } from '@testing-library/react-native'
import "@testing-library/jest-dom/extend-expect"
import { format } from 'date-fns'

test("should render listByDay", () => {
    const { getByTestId } = render(<ListByDay/>)
    const header = getByTestId('header')
    expect(header).toBeTruthy()
})



    test('should filter gigs by date', () => {
      // create an array of gigs
      const gigs = [
        { dateAndTime: { seconds: 1609459200 } }, // 1 September 2021
        { dateAndTime: { seconds: 1609545600 } }, // 2 September 2021
        { dateAndTime: { seconds: 1609632000 } }, // 3 September 2021
      ]
  
      // create a new date object with the current date
      const currentDate = new Date(2021, 0, 1) // 1 September 2021
  
      // pass the gigs and currentDate to the filter function
      const gigsToday = gigs.filter((gig) => { 
        const formattedDate = format(currentDate, 'do MMMM Y')
        const formattedGigDate = format(new Date(gig.dateAndTime.seconds*1000) ,'do MMMM Y')
        return formattedGigDate === formattedDate
      })
  
      // check that the filter function returned the correct gigs
      expect(gigsToday).toStrictEqual([{ dateAndTime: { seconds: 1609459200 } }])
    })
