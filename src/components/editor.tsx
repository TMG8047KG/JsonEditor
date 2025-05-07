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
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {!projectStarted ? (
          <button className={styles.button} onClick={createProject}>
            Create project
          </button>
        ) : (
          <>
            <Table ref={tableRef} />
            <Controls onAddRow={handleAddRow} onRemoveRow={handleRemoveRow} onClearTable={handleClearTable}/>
          </>
        )}
      </div>
    </div>
  )
}

export default Editor;