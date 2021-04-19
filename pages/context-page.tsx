import Layout from '../components/Layout';
import { SteteProvider } from '../context/StateProvider';
import ContextMain from '../components/ContextMain';
import ContextSub from '../components/ContextSub';

const ContextPage: React.FC = () => (
  <Layout title="Context">
    <p className="text-4xl mb-10">context page</p>
    <SteteProvider>
      <ContextMain />
      <ContextSub />
    </SteteProvider>
  </Layout>
);

export default ContextPage;
