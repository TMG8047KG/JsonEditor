import { useEffect, useRef } from 'react';
import style from './styles/cell.module.css'

interface CellProps {
    id: string;
    name: string;
    val: string | number;
    isSelected: boolean;
    onSelect: () => void;
    isExpandable?: boolean;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    onNameChange?: (id: string, value: string) => void;
    onValueChange?: (id: string, value: string) => void;
    isKeyEditable?: boolean;
    isValueEditable?: boolean;
    onAddRow?: () => void;
}

function Cell({ 
    id, 
    name, 
    val, 
    isSelected, 
    onSelect,
    isExpandable = false,
    isExpanded = false,
    onToggleExpand,
    onNameChange,
    onValueChange,
    isKeyEditable = true,
    isValueEditable = true,
    onAddRow
}: CellProps) {
    
    const nameRef = useRef<HTMLSpanElement>(null);
    const valueRef = useRef<HTMLSpanElement>(null);
    
    // Handle content changes directly with React events
    const handleNameBlur = () => {
        if (onNameChange && nameRef.current && isKeyEditable) {
            onNameChange(id, nameRef.current.textContent || '');
        }
    };
    
    const handleValueBlur = () => {
        if (onValueChange && valueRef.current && isValueEditable) {
            onValueChange(id, valueRef.current.textContent || '');
        }
    };
    
    // Update content editable fields when props change
    useEffect(() => {
        if (nameRef.current && nameRef.current.textContent !== name) {
            nameRef.current.textContent = name;
        }
        
        if (valueRef.current && valueRef.current.textContent !== String(val)) {
            valueRef.current.textContent = String(val);
        }
    }, [name, val]);

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect();
    };

    const handleExpandClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleExpand) {
            onToggleExpand();
        }
    };

    const handleAddRowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAddRow) {
            onAddRow();
        }
    };

    // Prevent Enter key from creating new lines in contentEditable
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <>
        <div className={style.container}>
            <div className={style.row}>
            {isSelected ? <button className={style.deleteButton}>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button> : ""}
                <div className={`${style.content} ${isSelected ? style.selected : ''}`} onClick={handleContentClick} data-id={id}>
                    <span ref={nameRef}
                        contentEditable={isKeyEditable}
                        className={`${style.key} ${!isKeyEditable ? style.keyNotEditable : ''}`}
                        onKeyDown={handleKeyDown}
                        onBlur={handleNameBlur}
                        suppressContentEditableWarning={true}
                        data-placeholder={"key"}>
                        {name}
                    </span>
                    
                    {!isExpandable && (
                        <span ref={valueRef}
                            contentEditable={isValueEditable}
                            className={`${style.value} ${!isValueEditable ? style.valueNotEditable : ''}`}
                            onKeyDown={handleKeyDown}
                            onBlur={handleValueBlur}
                            suppressContentEditableWarning={true}
                            data-placeholder={"value"}>
                            {val}
                        </span>
                    )}
                    
                    {isExpandable && (
                        <button className={style.expandButton} onClick={handleExpandClick}>
                            {isExpanded ? '−' : '+'}
                        </button>
                    )}
                </div>
                </div>
                {!isExpandable && isSelected ? <button className={style.addRowButton} onClick={handleAddRowClick}>Add Row</button> : ""}
            </div>
        </>
    )
}

export default Cell;