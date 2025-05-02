import "./App.css";
import Navbar from "./components/nav";
import Controls from "./components/controls";
import Editor from "./components/editor";

function App() {

  
  return (
    <div>
      <Navbar/>
      <div>
        <Editor/>
        <Controls/>
      </div>

    </div>
  );
}

export default App;
