import '@testing-library/jest-dom/extend-expect';
import { render, screen, cleanup } from '@testing-library/react';
import { initTestHelpers } from 'next-page-tester';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';

import { ENDPOINT } from '../lib/fetch';
import TaskPage from '../pages/task-page';
import { TASK } from '../types/Types';

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
            title: `dummy dynamic task ${id}`,
            completed: id % 2 == 0, // 偶数: true
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

describe('Todo page with useSWR', () => {
  const staticProps: TASK[] = ids.map((id) => ({
    userId: id,
    id,
    title: `dummy static task ${id}`,
    completed: id % 2 == 1, // 奇数: true
  }));

  it('Should render CSF data after pre-rendered data', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TaskPage staticTasks={staticProps} />
      </SWRConfig>
    );

    expect(
      await screen.findByText(/1: dummy static task 1/)
    ).toBeInTheDocument();
    expect(screen.getByText(/2: dummy static task 2/)).toBeInTheDocument();
    // screen.debug();

    expect(
      await screen.findByText(/1: dummy dynamic task 1/)
    ).toBeInTheDocument();
    expect(screen.getByText(/2: dummy dynamic task 2/)).toBeInTheDocument();
    // screen.debug();
  });

  it('Should render error text when fetch failed', async () => {
    server.use(
      rest.get(
        `${ENDPOINT}/todos/`,
        (req, res, ctx) =>
          // クライアントサイドでエラーになるように変更
          req.url.searchParams.get('_limit') === '10' && res(ctx.status(400))
      )
    );
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TaskPage staticTasks={staticProps} />
      </SWRConfig>
    );

    expect(await screen.findByText('Error!')).toBeInTheDocument();
    // screen.debug();
  });
});
