import '@testing-library/jest-dom/extend-expect';
import { render, screen, cleanup } from '@testing-library/react';
import { getPage } from 'next-page-tester';
import { initTestHelpers } from 'next-page-tester';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

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
  ...ids.map((id) =>
    rest.get(`${ENDPOINT}/posts/${id}`, (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          userId: id,
          id,
          title: `dummy title ${id}`,
          body: `dummy body ${id}`,
        })
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

describe('Blog detail page', () => {
  it('Should render detailed content of id 1', async () => {
    const { page } = await getPage({ route: '/posts/1' });
    render(page);

    expect(await screen.findByText('dummy title 1')).toBeInTheDocument();
    expect(screen.getByText('dummy body 1')).toBeInTheDocument();
    //screen.debug()
  });

  it('Should render detailed content of id 2', async () => {
    const { page } = await getPage({ route: '/posts/2' });
    render(page);

    expect(await screen.findByText('dummy title 2')).toBeInTheDocument();
    expect(screen.getByText('dummy body 2')).toBeInTheDocument();
  });

  it('Should route back to blog-page from detail page', async () => {
    const { page } = await getPage({ route: '/posts/3' });
    render(page);

    await screen.findByText('dummy title 3');
    userEvent.click(screen.getByTestId('back-blog'));
    expect(await screen.findByText('blog page')).toBeInTheDocument();
  });
});
