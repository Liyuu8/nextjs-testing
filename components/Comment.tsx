import { COMMENT } from '../types/Types';

const Comment: React.FC<COMMENT> = ({ id, name, body }) => (
  <li className="mx-10">
    <p>
      {id}: {body}
    </p>
    <p className="text-center mt-3 mb-10">by {name}</p>
  </li>
);

export default Comment;