import { GetStaticProps } from 'next';

import Layout from '../components/Layout';
import { getAllPostsData } from '../lib/fetch';
import { POST } from '../types/Types';
import Post from '../components/Post';

interface STATIC_PROPS {
  posts: POST[];
}

const BlogPage: React.FC<STATIC_PROPS> = ({ posts }) => (
  <Layout title="Blog">
    <p className="text-4xl mb-10">blog page</p>
    <ul>
      {posts && posts.map((post) => <Post key={post.id} {...post}></Post>)}
    </ul>
  </Layout>
);

export default BlogPage;

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPostsData();

  return { props: { posts } };
};
