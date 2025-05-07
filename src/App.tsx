import "./App.css";
import Navbar from "./components/nav";
import Editor from "./components/editor";
import style from "./main.module.css"

function App() {
  return (
    <div>
      <Navbar/>
      <div className={style.container}>
        <Editor/>
      </div>
    </div>
  );
}

export default App;
