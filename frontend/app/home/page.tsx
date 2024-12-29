import { Actions } from './actions';
import { Balance } from './balance';
import { Chart } from './chart';
import { Header } from './header';
import { Infos } from './stats';

const Home = () => {
  return (
    <div className="h-[100vh] w-full">
      <Header />
      <Balance />
      <Infos />
      <Actions />
    </div>
  );
};

export default Home;
