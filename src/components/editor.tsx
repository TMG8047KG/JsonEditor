import { useState, useRef } from "react";
import styles from './styles/editor.module.css'
import Table, { TableHandle } from "./table";
import Controls from "./controls";

function Editor() {
  const [projectStarted, setProjectStarted] = useState(false);
  const tableRef = useRef<TableHandle>(null);

  const createProject = () => {
    setProjectStarted(true);
  }

  // Handle table operations
  const handleAddRow = () => {
    tableRef.current?.addRow();
  }

  const handleRemoveRow = () => {
    tableRef.current?.removeRow();
  }

  const handleClearTable = () => {
    tableRef.current?.clearTable();
  }

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        {!projectStarted ? (
          <button className={styles.button} onClick={createProject}>
            Create project
          </button>
        ) : (<Table ref={tableRef}/>)}
      </div>
      {!projectStarted ? "" : <Controls onAddRow={handleAddRow} onRemoveRow={handleRemoveRow} onClearTable={handleClearTable}/>}
    </div>
  )
}

export default Editor;