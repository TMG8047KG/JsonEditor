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
}

function Cell({ 
    id, 
    name, 
    val, 
    isSelected, 
    onSelect,
    isExpandable = false,
    isExpanded = false,
    onToggleExpand 
}: CellProps) {
    
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

    return (
        <div 
            className={`${style.content} ${isSelected ? style.selected : ''}`} 
            onClick={handleContentClick}
            data-id={id}
        >
            <span contentEditable className={style.key}>
                {name}
            </span>
            
            {/* Only show value span if not expandable */}
            {!isExpandable && (
                <span contentEditable className={style.value}>
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