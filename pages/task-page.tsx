import { GetStaticProps } from 'next';
import axios from 'axios';
import useSWR from 'swr';

import Layout from '../components/Layout';
import { ENDPOINT, getAllTasksData } from '../lib/fetch';
import { TASK } from '../types/Types';

interface STATIC_PROPS {
  staticTasks: TASK[];
}

const axiosFetcher = async () => {
  const result = await axios.get<TASK[]>(`${ENDPOINT}/todos/?_limit=10`);

  return result.data;
};

const TaskPage: React.FC<STATIC_PROPS> = ({ staticTasks }) => {
  const { data: tasks, error } = useSWR('todosFetch', axiosFetcher, {
    initialData: staticTasks,
    revalidateOnMount: true,
  });

  return error ? (
    <span>Error!</span>
  ) : (
    <Layout title="Todos">
      <p className="text-4xl mb-10">todos page</p>
      <ul>
        {tasks &&
          tasks.map((task) => (
            <li key={task.id}>
              {task.id}: {task.title}
            </li>
          ))}
      </ul>
    </Layout>
  );
};

export default TaskPage;

export const getStaticProps: GetStaticProps = async () => {
  const staticTasks = await getAllTasksData();

  return { props: { staticTasks } };
};
