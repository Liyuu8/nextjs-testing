import useSWR from 'swr';
import axios from 'axios';

import Layout from '../components/Layout';
import Comment from '../components/Comment';
import { COMMENT } from '../types/Types';
import { ENDPOINT } from '../lib/fetch';

const axiosFetcher = async () => {
  const result = await axios.get<COMMENT[]>(`${ENDPOINT}/comments/?_limit=10`);

  return result.data;
};

const CommentPage: React.FC = () => {
  const { data: comments, error } = useSWR('commentsFetch', axiosFetcher);

  return error ? (
    <span>Error!</span>
  ) : (
    <Layout title="Comment">
      <p className="text-4xl m-10">comment page</p>
      <ul>
        {comments &&
          comments.map((comment) => <Comment key={comment.id} {...comment} />)}
      </ul>
    </Layout>
  );
};

export default CommentPage;
