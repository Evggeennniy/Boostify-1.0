import { Notifications } from "./components/Notifications";
import { Header } from "./components/Header";
import { Intro } from "./components/Intro";
import { Workplace } from "./components/Workplace";
import { Payment } from "./components/Payment";
import { WorkSteps } from "./components/Steps";
import { Allowed } from "./components/Allowed";
import { PageWrap } from "./components/PageWrap";
import { useGlobalContext } from "./context/GlobalContext";

import "./App.css";

function App() {
  const { pageState } = useGlobalContext();

  const renderWorkplace = () => {
    switch (pageState) {
      case "ordering":
        return <Workplace />;
      case "payment":
        return <Payment />;
      default:
        return <div>404</div>;
    }
  };

  return (
    <PageWrap>
      <Notifications />
      <Header />
      <Intro />
      {renderWorkplace()}
      <WorkSteps />
      <Allowed />
    </PageWrap>
  );
}

export default App;
