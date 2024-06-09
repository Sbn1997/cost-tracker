/* Yarin Ben Moshe 314939885
Amit Rahamim 318816535
Shahar Ben Naim 208628453 */

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
