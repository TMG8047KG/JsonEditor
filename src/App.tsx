import "./App.css";
import Navbar from "./components/nav";
import Controls from "./components/controls";
import Editor from "./components/editor";
import style from "./main.module.css"

function App() {

  
  return (
    <div>
      <Navbar/>
      <div className={style.container}>
        <h1 className={style.title}>Json Editor</h1>
        <Editor/>
        <Controls/>
      </div>

    </div>
  );
}

export default App;
