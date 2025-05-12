import { useState, useRef } from "react";
import styles from './styles/editor.module.css'
import Table, { TableHandle } from "./table";
import Controls from "./controls";

function Editor() {
  const [projectStarted, setProjectStarted] = useState(false);
  const [hasSelectedRow, setHasSelectedRow] = useState(false);
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
    setHasSelectedRow(false);
  }

  const handleAddNestedRow = () => {
    tableRef.current?.addNestedRow();
  }

  const handleRemoveSelectedRow = () => {
    tableRef.current?.removeSelectedRow();
    setHasSelectedRow(false);
  }

  // Toggle editability
  const handleToggleKeyEditable = () => {
    tableRef.current?.toggleKeyEditable();
  }

  const handleToggleValueEditable = () => {
    tableRef.current?.toggleValueEditable();
  }

  // Handle row selection change
  const handleSelectionChange = (selected: boolean) => {
    setHasSelectedRow(selected);
  }

  // Handle file operations
  const handleLoadData = (data: any) => {
    tableRef.current?.loadData(data);
  }

  const handleGetData = () => {
    return tableRef.current?.getData() || {};
  }

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        {!projectStarted ? (
          <button className={styles.button} onClick={createProject}>
            Create project
          </button>
        ) : (
          <>
         
          <Table 
            ref={tableRef} 
            onSelectionChange={handleSelectionChange}
          />
          <Controls 
            onClearTable={handleClearTable}
            onAddNestedRow={handleAddNestedRow}
            hasSelectedRow={hasSelectedRow}
            onLoadData={handleLoadData}
            onGetData={handleGetData}
            onToggleKeyEditable={handleToggleKeyEditable}
            onToggleValueEditable={handleToggleValueEditable}
          />
        </>
        )}
      </div>
    </div>
  )
}

export default Editor;