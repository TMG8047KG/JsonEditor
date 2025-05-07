import { useRef } from "react";
import style from './styles/table.module.css'
import Cell from "./cell";



function table(){
    const tableRef = useRef<HTMLDivElement>(null);

    return(
        <div className={style.table} ref={tableRef}>
            <Cell name={"key"} val={"value"}/>
        </div>
    )
}

export default table;
