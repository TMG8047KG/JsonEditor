import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import style from './styles/table.module.css'
import Cell from "./cell";

// Define the handle type for the table
export type TableHandle = {
  addRow: () => void;
  removeRow: () => void;
  clearTable: () => void;
  addNestedRow: () => void;
  removeSelectedRow: () => void;
};

// Define row types for better type safety
export type TableRow = {
  id: string;
  key: string;
  value: string | number | TableRow[];
  isSelected: boolean;
  parentId: string | null;
  isExpanded?: boolean;
};

// Define props interface for the Table component
interface TableProps {
  onSelectionChange?: (selected: boolean) => void;
}

const Table = forwardRef<TableHandle, TableProps>(({ onSelectionChange }, ref) => {
    const [rows, setRows] = useState<TableRow[]>([
        { id: "row-" + Date.now(), key: "key", value: "value", isSelected: false, parentId: null }
    ]);
    
    const tableRef = useRef<HTMLDivElement>(null);
    
    // Handle row selection
    const handleSelectRow = (id: string) => {
        setRows(prevRows => {
            const updatedRows = prevRows.map(row => ({
                ...row,
                isSelected: row.id === id ? true : false
            }));
            
            // Notify parent component about selection change
            if (onSelectionChange) {
                onSelectionChange(true);
            }
            
            return updatedRows;
        });
    };

    // Find selected row
    const getSelectedRow = () => {
        return rows.find(row => row.isSelected);
    };

    // Get all top-level rows (no parent)
    const getTopLevelRows = () => {
        return rows.filter(row => row.parentId === null);
    };

    // Get child rows for a specific parent
    const getChildRows = (parentId: string) => {
        return rows.filter(row => row.parentId === parentId);
    };

    // Toggle expansion of a row with nested items
    const toggleExpand = (id: string) => {
        setRows(prevRows => 
            prevRows.map(row => ({
                ...row,
                isExpanded: row.id === id ? !row.isExpanded : row.isExpanded
            }))
        );
    };
    
    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
        addRow: () => {
            setRows(prevRows => [
                ...prevRows, 
                { 
                    id: "row-" + Date.now(), 
                    key: "", 
                    value: "", 
                    isSelected: false, 
                    parentId: null 
                }
            ]);
        },
        removeRow: () => {
            if (rows.length > 0) {
                // Remove the last top-level row
                const topLevelRows = getTopLevelRows();
                if (topLevelRows.length > 0) {
                    const lastRow = topLevelRows[topLevelRows.length - 1];
                    setRows(prevRows => prevRows.filter(row => 
                        row.id !== lastRow.id && row.parentId !== lastRow.id
                    ));
                }
            }
        },
        clearTable: () => {
            setRows([]);
            // Notify parent component about selection change
            if (onSelectionChange) {
                onSelectionChange(false);
            }
        },
        addNestedRow: () => {
            const selectedRow = getSelectedRow();
            if (selectedRow) {
                // Check if the selected row's value is empty or not an array
                if (typeof selectedRow.value !== 'object') {
                    // Create a new row as a child of the selected row
                    const newRow = { 
                        id: "row-" + Date.now(), 
                        key: "", 
                        value: "", 
                        isSelected: false, 
                        parentId: selectedRow.id 
                    };
                    
                    // Update the selected row to have an array value and be expanded
                    setRows(prevRows => 
                        prevRows.map(row => 
                            row.id === selectedRow.id ? 
                            { ...row, value: [], isExpanded: true } : 
                            row
                        ).concat(newRow)
                    );
                } else {
                    // Just add a new nested row to the existing array
                    const newRow = { 
                        id: "row-" + Date.now(), 
                        key: "", 
                        value: "", 
                        isSelected: false, 
                        parentId: selectedRow.id 
                    };
                    setRows(prevRows => [...prevRows, newRow]);
                }
            }
        },
        removeSelectedRow: () => {
            const selectedRow = getSelectedRow();
            if (selectedRow) {
                // Remove the selected row and its children
                setRows(prevRows => prevRows.filter(row => 
                    row.id !== selectedRow.id && row.parentId !== selectedRow.id
                ));
                
                // Notify parent component about selection change
                if (onSelectionChange) {
                    onSelectionChange(false);
                }
            }
        }
    }));

    // Recursive function to render rows with proper nesting
    const renderRows = (parentId: string | null) => {
        const rowsToRender = rows.filter(row => row.parentId === parentId);
        
        return rowsToRender.map(row => {
            const hasChildren = rows.some(r => r.parentId === row.id);
            const isArrayValue = Array.isArray(row.value) || hasChildren;
            
            return (
                <div key={row.id} className={row.isSelected ? `${style.row} ${style.selected}` : style.row}>
                    <Cell 
                        id={row.id}
                        name={row.key} 
                        val={isArrayValue ? "" : row.value} 
                        isSelected={row.isSelected}
                        onSelect={() => handleSelectRow(row.id)}
                        isExpandable={isArrayValue}
                        isExpanded={row.isExpanded}
                        onToggleExpand={() => toggleExpand(row.id)}
                    />
                    
                    {/* Render children if expanded and has children */}
                    {hasChildren && row.isExpanded && (
                        <div className={style.nestedRows}>
                            {renderRows(row.id)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className={style.table} ref={tableRef}>
            {rows.length < 1 ? (
                <div className={style.empty}>There's no objects!</div>
            ) : (
                renderRows(null)
            )}
        </div>
    );
});

export default Table;