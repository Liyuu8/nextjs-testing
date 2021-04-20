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
    `${ENDPOINT}/todos/`,
    (req, res, ctx) =>
      req.url.searchParams.get('_limit') === '10' &&
      res(
        ctx.status(200),
        ctx.json(
          ids.map((id) => ({
            userId: id,
            id,
            title: `dummy static task ${id}`,
            completed: id % 2 == 1, // 奇数: true
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

describe('Todo page with getStaticProps', () => {
  it('Should render the list of tasks pre-fetched by getStaticProps', async () => {
    const { page } = await getPage({ route: '/task-page' });
    render(page);

    expect(await screen.findByText('todos page')).toBeInTheDocument();
    expect(screen.getByText(/1: dummy static task 1/)).toBeInTheDocument();
    expect(screen.getByText(/2: dummy static task 2/)).toBeInTheDocument();
  });
});
