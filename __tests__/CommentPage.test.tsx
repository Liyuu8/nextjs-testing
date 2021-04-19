import '@testing-library/jest-dom/extend-expect';
import { render, screen, cleanup } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { initTestHelpers } from 'next-page-tester';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import CommentPage from '../pages/comment-page';
import { ENDPOINT } from '../lib/fetch';

initTestHelpers();

const ids = [1, 2, 3];
const handlers = [
  rest.get(
    `${ENDPOINT}/comments/`,
    (req, res, ctx) =>
      req.url.searchParams.get('_limit') === '10' &&
      res(
        ctx.status(200),
        ctx.json(
          ids.map((id) => ({
            postId: id,
            id,
            name: `user ${id}`,
            email: `dummy${id}@example.com`,
            body: `dummy comment ${id}`,
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
  // cache.clear();
});
afterAll(() => server.close());

describe('Comment page with useSWR (Success)', () => {
  it('Should render the value fetched by useSWR', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CommentPage />
      </SWRConfig>
    );

    expect(await screen.findByText('1: dummy comment 1')).toBeInTheDocument();
    expect(screen.getByText('2: dummy comment 2')).toBeInTheDocument();
  });
});

describe('Comment page with useSWR (Failed)', () => {
  it('Should render error text when fetch failed', async () => {
    server.use(
      rest.get(
        `${ENDPOINT}/comments/`,
        (req, res, ctx) =>
          // クライアントサイドでエラーになるように変更
          req.url.searchParams.get('_limit') === '10' && res(ctx.status(400))
      )
    );
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CommentPage />
      </SWRConfig>
    );

    expect(await screen.findByText('Error!')).toBeInTheDocument();
    // screen.debug();
  });
});
