import '@testing-library/jest-dom/extend-expect';
import { render, screen, cleanup } from '@testing-library/react';
import { getPage } from 'next-page-tester';
import { initTestHelpers } from 'next-page-tester';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { ENDPOINT } from '../lib/fetch';

initTestHelpers();

const ids = [1, 2, 3];
const handlers = [
  rest.get(
    `${ENDPOINT}/posts/`,
    (req, res, ctx) =>
      req.url.searchParams.get('_limit') === '10' &&
      res(
        ctx.status(200),
        ctx.json(
          ids.map((id) => ({
            userId: id,
            id,
            title: `dummy title ${id}`,
            body: `dummy body ${id}`,
          }))
        )
      )
  ),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

describe('Blog page', () => {
  it('Should render the list of blogs pre-fetched by getStaticProps', async () => {
    const { page } = await getPage({ route: '/blog-page' });
    render(page);

    expect(await screen.findByText('blog page')).toBeInTheDocument();
    expect(screen.getByText('dummy title 1')).toBeInTheDocument();
    expect(screen.getByText('dummy title 2')).toBeInTheDocument();
    expect(screen.getByText('dummy title 3')).toBeInTheDocument();
  });
});
