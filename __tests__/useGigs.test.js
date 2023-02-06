import { useGigs } from "../hooks/useGigs";
import "@testing-library/jest-dom/extend-expect"

jest.mock('react', () => {
    const actualReact = jest.requireActual('react');
    return {
      ...actualReact,
      useState: initialValue => [initialValue, jest.fn()],
      useEffect: jest.fn(),
    };
  });
  
    it('returns gigs data', () => {
      const gigs = useGigs();
      expect(gigs).toBeTruthy();
    });

  
  
  
  
  
  
  