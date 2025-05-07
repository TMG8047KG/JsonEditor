import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import style from './styles/table.module.css'
import Cell from "./cell";

// Define the handle type for the table
export type TableHandle = {
  addRow: () => void;
  removeRow: () => void;
  clearTable: () => void;
};

// Define a row type for better type safety
type TableRow = {
  id: string;
  key: string;
  value: string | number;
};

const Table = forwardRef<TableHandle>((_, ref) => {
    const [rows, setRows] = useState<TableRow[]>([
        { id: "row-" + Date.now(), key: "key", value: "value" }
    ]);
    
    const tableRef = useRef<HTMLDivElement>(null);
    
    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
        addRow: () => {
            setRows(prevRows => [
                ...prevRows, 
                { id: "row-" + Date.now(), key: "", value: "" }
            ]);
        },
        removeRow: () => {
            if (rows.length > 0) {
                setRows(prevRows => prevRows.slice(0, -1));
            }
        },
        clearTable: () => {
            setRows([]);
        }
    }));

    return (
        <div className={style.table} ref={tableRef}>
            {rows.length < 1 ? "There's no objects!" : rows.map(row => (
                <Cell key={row.id} name={row.key} val={row.value} />
            ))}
        </div>
    );
});

export default Table;