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
    onValueChange
}: CellProps) {
    
    const nameRef = useRef<HTMLSpanElement>(null);
    const valueRef = useRef<HTMLSpanElement>(null);
    
    // Handle content changes directly with React events
    const handleNameBlur = () => {
        if (onNameChange && nameRef.current) {
            onNameChange(id, nameRef.current.textContent || '');
        }
    };
    
    const handleValueBlur = () => {
        if (onValueChange && valueRef.current) {
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

    // Prevent Enter key from creating new lines in contentEditable
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <div 
            className={`${style.content} ${isSelected ? style.selected : ''}`} 
            onClick={handleContentClick}
            data-id={id}
        >
            <span 
                ref={nameRef}
                contentEditable 
                className={style.key}
                onKeyDown={handleKeyDown}
                onBlur={handleNameBlur}
                suppressContentEditableWarning={true}
            >
                {name}
            </span>
            
            {/* Only show value span if not expandable */}
            {!isExpandable && (
                <span 
                    ref={valueRef}
                    contentEditable 
                    className={style.value}
                    onKeyDown={handleKeyDown}
                    onBlur={handleValueBlur}
                    suppressContentEditableWarning={true}
                >
                    {val}
                </span>
            )}
            
            {isExpandable && (
                <button 
                    className={style.expandButton}
                    onClick={handleExpandClick}
                >
                    {isExpanded ? '−' : '+'}
                </button>
            )}
        </div>
    )
}

export default Cell;