import { useState } from "react";
import styles from './styles/editor.module.css'

function editor(){
  const [project, setProject] = useState(false);

  const createProject = () => {
    setProject(true);
    
  }

  return (
      <div className={styles.wrapper}>
      <div className={styles.container}>
        {project != true ? <button className={styles.button} onClick={createProject}>Create project</button> : ""}
      </div>
    </div>
  )
}

export default editor;