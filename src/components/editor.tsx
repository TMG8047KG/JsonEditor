import { useState } from "react";
import styles from './styles/editor.module.css'
import Table from "./table";
import { createRoot } from "react-dom/client";

function editor(){
  const [project, setProject] = useState(false);

  const createProject = () => {
    setProject(true);
    const con = document.getElementById("container");
    if(con) {
      const root = createRoot(con);
      root.render(<Table/>);
    }
  }

  return (
      <div className={styles.wrapper}>
      <div id="container" className={styles.container}>
        {project != true ? <button className={styles.button} onClick={createProject}>Create project</button> : ""}
      </div>
    </div>
  )
}

export default editor;