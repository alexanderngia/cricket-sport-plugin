import "./App.css";
import { Tab } from "../src/components/tab";

function App() {
  return (
    <div className="wp-h-full wp-w-full wp-antialiased wp-font-sans">
      <div className="wp-flex wp-items-center wp-justify-center">
        <div className="wp-w-full wp-h-full  md:wp-max-w-[1920px] wp-items-center wp-justify-center">
          <Tab />
        </div>
      </div>
    </div>
  );
}

export default App;
