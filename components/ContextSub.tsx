import { useStateContext } from '../context/StateProvider';

const ContextSub: React.FC = () => {
  const { toggle } = useStateContext();

  return (
    <>
      <p>Context Sub</p>
      <p className="mb-5 text-indigo600" data-testid="toggle-sub">
        {toggle ? 'true' : 'false'}
      </p>
    </>
  );
};

export default ContextSub;
