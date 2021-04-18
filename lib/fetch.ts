import fetch from 'node-fetch';

export const ENDPOINT = 'https://jsonplaceholder.typicode.com';

export const getAllPostsData = async () => {
  const response = await fetch(new URL(`${ENDPOINT}/posts/?_limit=10`));
  const posts = await response.json();

  return posts;
};

export const getAllTasksData = async () => {
  const response = await fetch(new URL(`${ENDPOINT}/todos/?_limit=10`));
  const tasks = await response.json();

  return tasks;
};

export const getAllPostIds = async () => {
  const posts = await getAllPostsData();

  return posts.map((post) => ({ params: { id: String(post.id) } }));
};

export const getPostData = async (id: string) => {
  const response = await fetch(new URL(`${ENDPOINT}/posts/${id}`));
  const post = await response.json();

  return post;
};
