import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SteteProvider } from '../context/StateProvider';
import ContextMain from '../components/ContextMain';
import ContextSub from '../components/ContextSub';

describe('Global state management (useContext)', () => {
  it('Should change the toggle state globally', () => {
    render(
      <SteteProvider>
        <ContextMain />
        <ContextSub />
      </SteteProvider>
    );

    expect(screen.getByTestId('toggle-main').textContent).toBe('false');
    expect(screen.getByTestId('toggle-sub').textContent).toBe('false');

    userEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('toggle-main').textContent).toBe('true');
    expect(screen.getByTestId('toggle-sub').textContent).toBe('true');
  });
});
