import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Post from '../components/Post';

describe('Post component with given props', () => {
  const dummyProps = {
    userId: 1,
    id: 1,
    title: 'dummy title 1',
    body: 'dummy body 1',
  };

  it('Should render corrently with given props value', async () => {
    render(<Post {...dummyProps} />);
    expect(screen.getByText(dummyProps.title)).toBeInTheDocument();
  });
});
