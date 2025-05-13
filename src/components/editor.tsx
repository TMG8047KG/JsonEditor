import { useState, useRef } from "react";
import styles from './styles/editor.module.css'
import Table, { TableHandle, TableRow } from "./table";
import Controls from "./controls";
import Modal from "./modal";

function Editor() {
  const [projectStarted, setProjectStarted] = useState(false);
  const [hasSelectedRow, setHasSelectedRow] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
    confirmText: "OK",
    cancelText: "Cancel",
    type: "warning" as "warning" | "error" | "info"
  });
  const tableRef = useRef<TableHandle>(null);

  const createProject = () => {
    setProjectStarted(true);
  }

  // Check for empty keys
  const checkEmptyKeys = (rows: TableRow[]): boolean => {
    // Find rows with empty keys but have values or children
    const emptyKeyRows = rows.filter(row => {
      const hasValue = typeof row.value === 'string' || typeof row.value === 'number' 
        ? row.value !== '' 
        : Array.isArray(row.value);
      const hasChildren = rows.some(childRow => childRow.parentId === row.id);
      
      return row.key === '' && (hasValue || hasChildren);
    });
    
    return emptyKeyRows.length > 0;
  };

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
    // Get the data
    const data = tableRef.current?.getData() || {};
    
    // Check for empty keys before allowing save
    const rows = tableRef.current?.getAllRows() || [];
    if (checkEmptyKeys(rows)) {
      setModalState({
        isOpen: true,
        title: "Empty Key Warning",
        message: "Some fields have empty keys but contain values. Empty keys will be omitted when saving. Do you want to continue?",
        onConfirm: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          // Proceed with the save operation
          return data;
        },
        onCancel: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          // Cancel the save operation
          return null;
        },
        confirmText: "Save Anyway",
        cancelText: "Cancel",
        type: "warning"
      });
      return null;
    }
    
    return data;
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
          <Modal 
            isOpen={modalState.isOpen}
            title={modalState.title}
            message={modalState.message}
            onConfirm={modalState.onConfirm}
            onCancel={modalState.onCancel}
            confirmText={modalState.confirmText}
            cancelText={modalState.cancelText}
            type={modalState.type}
          />
        </>
        )}
      </div>
    </div>
  )
}

export default Editor;