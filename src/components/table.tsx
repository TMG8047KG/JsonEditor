import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import style from './styles/table.module.css'
import Cell from "./cell";

// Define the handle type for the table
export type TableHandle = {
  addRow: () => void;
  removeRow: () => void;
  clearTable: () => void;
  addNestedRow: () => void;
  removeSelectedRow: () => void;
  loadData: (data: any) => void;
  getData: () => any;
  updateCellKey: (id: string, value: string) => void;
  updateCellValue: (id: string, value: string) => void;
  toggleKeyEditable: () => void;
  toggleValueEditable: () => void;
};

// Define row types for better type safety
export type TableRow = {
  id: string;
  key: string;
  value: string | number | TableRow[];
  isSelected: boolean;
  parentId: string | null;
  isExpanded?: boolean;
  order: number; // Add order property to maintain row positions
};

// Define props interface for the Table component
interface TableProps {
  onSelectionChange?: (selected: boolean) => void;
}

const Table = forwardRef<TableHandle, TableProps>(({ onSelectionChange }, ref) => {
    const [rows, setRows] = useState<TableRow[]>([
        { id: "row-" + Date.now(), key: "", value: "", isSelected: false, parentId: null, order: 0 }
    ]);
    const [maxOrder, setMaxOrder] = useState<number>(0);
    const [isKeyEditable, setIsKeyEditable] = useState<boolean>(true);
    const [isValueEditable, setIsValueEditable] = useState<boolean>(true);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [filteredRows, setFilteredRows] = useState<string[]>([]);
    
    const tableRef = useRef<HTMLDivElement>(null);
    
    // Handle row selection
    const handleSelectRow = (id: string) => {
        setRows(prevRows => {
            const updatedRows = prevRows.map(row => ({
                ...row,
                isSelected: row.id === id ? true : false
            }));
            
            return updatedRows;
        });
        
        // Notify parent component about selection change AFTER state update
        setTimeout(() => {
            if (onSelectionChange) {
                onSelectionChange(true);
            }
        }, 0);
    };

    // Find selected row
    const getSelectedRow = () => {
        return rows.find(row => row.isSelected);
    };

    // Get the position where to insert the new row
    const getInsertPosition = () => {
        const selectedRow = getSelectedRow();
        
        if (selectedRow) {
            // Get all rows with the same parent
            const siblings = rows.filter(row => row.parentId === selectedRow.parentId);
            
            // Find the next sibling after the selected row
            const nextSiblings = siblings.filter(row => row.order > selectedRow.order)
                .sort((a, b) => a.order - b.order);
                
            if (nextSiblings.length > 0) {
                // Return position after selected row but before next sibling
                return (selectedRow.order + nextSiblings[0].order) / 2;
            } else {
                // This is the last row in its group, add after it
                return selectedRow.order + 1;
            }
        } else {
            // No selection, add at the end of top-level rows
            const topLevelRows = rows.filter(row => row.parentId === null);
            if (topLevelRows.length > 0) {
                return Math.max(...topLevelRows.map(row => row.order)) + 1;
            } else {
                return 0;
            }
        }
    };

    // Get all top-level rows (no parent)
    const getTopLevelRows = () => {
        return rows.filter(row => row.parentId === null)
            .sort((a, b) => a.order - b.order);
    };

    // Get child rows for a specific parent
    const getChildRows = (parentId: string) => {
        return rows.filter(row => row.parentId === parentId)
            .sort((a, b) => a.order - b.order);
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

    // Handle search functionality
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value.trim().toLowerCase();
        setSearchKeyword(keyword);
        
        if (!keyword) {
            setFilteredRows([]);
            return;
        }
        
        // Find matching rows
        const matches = rows.filter(row => {
            const keyMatch = row.key.toLowerCase().includes(keyword);
            const valueMatch = typeof row.value === 'string' || typeof row.value === 'number' 
                ? String(row.value).toLowerCase().includes(keyword)
                : false;
                
            return keyMatch || valueMatch;
        }).map(row => row.id);
        
        setFilteredRows(matches);
        
        // Auto-expand parent rows of matches
        if (matches.length > 0) {
            setRows(prevRows => {
                return prevRows.map(row => {
                    // If this row has children that match the search
                    const hasMatchingChildren = rows.some(child => 
                        child.parentId === row.id && matches.includes(child.id)
                    );
                    
                    if (hasMatchingChildren) {
                        return { ...row, isExpanded: true };
                    }
                    return row;
                });
            });
        }
    };

    // Convert rows to JSON structure for saving
    const rowsToJson = () => {
        const result: any = {};
        
        // Process top-level rows first
        const topLevelRows = getTopLevelRows();
        
        topLevelRows.forEach(row => {
            // Check if this has children
            const children = getChildRows(row.id);
            
            if (children.length > 0) {
                // This is an object/array with nested values
                if (row.key) {
                    result[row.key] = processChildren(row.id);
                }
            } else {
                // This is a simple key-value pair
                if (row.key) {
                    result[row.key] = row.value;
                }
            }
        });
        
        return result;
    };
    
    // Process children rows recursively
    const processChildren = (parentId: string) => {
        const children = getChildRows(parentId);
        const result: any = {};
        
        children.forEach(child => {
            const grandchildren = getChildRows(child.id);
            
            if (grandchildren.length > 0) {
                // This child has its own children
                if (child.key) {
                    result[child.key] = processChildren(child.id);
                }
            } else {
                // This is a leaf node
                if (child.key) {
                    result[child.key] = child.value;
                }
            }
        });
        
        return result;
    };
    
    // Convert JSON to rows structure
    const jsonToRows = (json: any, parentId: string | null = null, startOrder: number = 0): TableRow[] => {
        const newRows: TableRow[] = [];
        let order = startOrder;
        
        if (typeof json === 'object' && json !== null) {
            // Handle object or array
            Object.keys(json).forEach(key => {
                const rowId = "row-" + Date.now() + Math.random().toString(36).substring(2, 9);
                const value = json[key];
                
                if (typeof value === 'object' && value !== null) {
                    // Create parent row
                    newRows.push({
                        id: rowId,
                        key: key,
                        value: [], // Placeholder for object/array
                        isSelected: false,
                        parentId: parentId,
                        isExpanded: true,
                        order: order++
                    });
                    
                    // Process children recursively
                    const childRows = jsonToRows(value, rowId, 0);
                    newRows.push(...childRows);
                } else {
                    // Simple key-value
                    newRows.push({
                        id: rowId,
                        key: key,
                        value: value,
                        isSelected: false,
                        parentId: parentId,
                        order: order++
                    });
                }
            });
        }
        
        // Update max order
        if (order > maxOrder && parentId === null) {
            setMaxOrder(order);
        }
        
        return newRows;
    };
    
    // Define addRow function that will be passed to Cell and exposed via ref
    const addRow = () => {
        setRows(prevRows => {
            const selectedRow = prevRows.find(row => row.isSelected);
            let newOrder = 0;
            let parentId: string | null = null;
            
            if (selectedRow) {
                // Add row as a sibling to the selected row
                parentId = selectedRow.parentId;
                
                // Get siblings of selected row
                const siblings = prevRows.filter(row => row.parentId === parentId);
                
                // Find next siblings (rows that come after the selected row)
                const nextSiblings = siblings
                    .filter(row => row.order > selectedRow.order)
                    .sort((a, b) => a.order - b.order);
                
                if (nextSiblings.length > 0) {
                    // Insert between selected row and next sibling
                    newOrder = (selectedRow.order + nextSiblings[0].order) / 2;
                } else {
                    // Selected row is last in its group, add after it
                    newOrder = selectedRow.order + 1;
                }
            } else {
                // No row selected, add at the end of top-level rows
                const topLevelRows = prevRows.filter(row => row.parentId === null);
                if (topLevelRows.length > 0) {
                    newOrder = Math.max(...topLevelRows.map(row => row.order)) + 1;
                }
            }
            
            // Create new row
            const newRow = { 
                id: "row-" + Date.now(), 
                key: "", 
                value: "", 
                isSelected: false, 
                parentId: parentId,
                order: newOrder
            };
            
            // Add new row to existing rows
            return [...prevRows, newRow];
        });
        
        // Update max order
        setMaxOrder(prevMaxOrder => prevMaxOrder + 1);
    };

    // Function to remove the selected row
    const removeSelectedRow = () => {
        const selectedRow = getSelectedRow();
        if (selectedRow) {
            // Remove the selected row and its children
            setRows(prevRows => prevRows.filter(row => 
                row.id !== selectedRow.id && row.parentId !== selectedRow.id
            ));
            
            // Notify parent component about selection change AFTER state update
            setTimeout(() => {
                if (onSelectionChange) {
                    onSelectionChange(false);
                }
            }, 0);
        }
    };
    
    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
        addRow,
        updateCellKey: (id: string, value: string) => {
            setRows(prevRows => 
                prevRows.map(row => 
                    row.id === id ? { ...row, key: value } : row
                )
            );
        },
        updateCellValue: (id: string, value: string) => {
            setRows(prevRows => 
                prevRows.map(row => 
                    row.id === id ? { ...row, value: value } : row
                )
            );
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
            setMaxOrder(0);
            setSearchKeyword(""); // Clear search when clearing table
            setFilteredRows([]);
            // Notify parent component about selection change AFTER state update
            setTimeout(() => {
                if (onSelectionChange) {
                    onSelectionChange(false);
                }
            }, 0);
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
                        parentId: selectedRow.id,
                        order: 0
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
                        parentId: selectedRow.id,
                        order: Math.max(
                            0, 
                            ...rows
                                .filter(row => row.parentId === selectedRow.id)
                                .map(row => row.order + 1)
                        )
                    };
                    setRows(prevRows => [...prevRows, newRow]);
                }
            }
        },
        removeSelectedRow,
        // Methods for file operations
        loadData: (data: any) => {
            // Convert JSON data to rows
            const newRows = jsonToRows(data);
            
            // Set the new rows
            if (newRows.length > 0) {
                setRows(newRows);
            } else {
                // If empty object, create at least one row
                setRows([{ 
                    id: "row-" + Date.now(), 
                    key: "", 
                    value: "", 
                    isSelected: false, 
                    parentId: null,
                    order: 0
                }]);
                setMaxOrder(0);
            }
            
            // Clear search when loading new data
            setSearchKeyword("");
            setFilteredRows([]);
            
            // Reset selection AFTER state update
            setTimeout(() => {
                if (onSelectionChange) {
                    onSelectionChange(false);
                }
            }, 0);
        },
        getData: () => {
            // Convert rows to JSON for saving
            return rowsToJson();
        },
        toggleKeyEditable: () => {
            setIsKeyEditable(prev => !prev);
        },
        toggleValueEditable: () => {
            setIsValueEditable(prev => !prev);
        }
    }));

    // Recursive function to render rows with proper nesting
    const renderRows = (parentId: string | null) => {
        const rowsToRender = rows
            .filter(row => row.parentId === parentId)
            .sort((a, b) => a.order - b.order);
        
        return rowsToRender.map(row => {
            const hasChildren = rows.some(r => r.parentId === row.id);
            const isArrayValue = Array.isArray(row.value) || hasChildren;
            const isHighlighted = searchKeyword && filteredRows.includes(row.id);
            
            // Skip rendering this branch if searching and there's no match in this branch
            if (searchKeyword && filteredRows.length > 0) {
                // Always render matching rows
                if (!isHighlighted) {
                    // For non-matching rows, check if any of their children match
                    const hasMatchingDescendant = (rowId: string): boolean => {
                        const directChildren = rows.filter(r => r.parentId === rowId);
                        return directChildren.some(child => 
                            filteredRows.includes(child.id) || hasMatchingDescendant(child.id)
                        );
                    };
                    
                    // Skip rendering this row if neither it nor its descendants match
                    if (!hasMatchingDescendant(row.id) && parentId !== null) {
                        return null;
                    }
                }
            }
            
            return (
                <div key={row.id} className={
                    `${style.row} 
                     ${row.isSelected ? style.selected : ''} 
                     ${isHighlighted ? style.highlight : ''}`
                }>
                    <Cell 
                        id={row.id}
                        name={row.key} 
                        val={isArrayValue ? "" : row.value} 
                        isSelected={row.isSelected}
                        onSelect={() => handleSelectRow(row.id)}
                        isExpandable={isArrayValue}
                        isExpanded={row.isExpanded}
                        onToggleExpand={() => toggleExpand(row.id)}
                        onNameChange={(id, value) => {
                            // Update row key directly
                            setRows(prevRows => 
                                prevRows.map(r => 
                                    r.id === id ? { ...r, key: value } : r
                                )
                            );
                        }}
                        onValueChange={(id, value) => {
                            // Convert to number if possible
                            const parsedValue = !isNaN(Number(value)) && value !== '' 
                                ? Number(value) 
                                : value;
                            
                            // Update row value directly
                            setRows(prevRows => 
                                prevRows.map(r => 
                                    r.id === id ? { ...r, value: parsedValue } : r
                                )
                            );
                        }}
                        isKeyEditable={isKeyEditable}
                        isValueEditable={isValueEditable}
                        onAddRow={addRow} // Pass addRow function to Cell
                        onRemoveRow={removeSelectedRow} // Pass removeSelectedRow function to Cell
                    />
                    
                    {/* Render children if expanded and has children */}
                    {hasChildren && row.isExpanded && (
                        <div className={style.nestedRows}>
                            {renderRows(row.id)}
                        </div>
                    )}
                </div>
            );
        }).filter(Boolean); // Filter out null values
    };

    // Effect to auto-expand parent rows when searching
    useEffect(() => {
        if (searchKeyword && filteredRows.length > 0) {
            // Auto-expand all parents of matching rows
            const expandParents = (rowId: string | null) => {
                if (!rowId) return;
                
                const parentRow = rows.find(row => row.id === rowId);
                if (parentRow && parentRow.parentId) {
                    setRows(prevRows => 
                        prevRows.map(row => 
                            row.id === parentRow.parentId ? { ...row, isExpanded: true } : row
                        )
                    );
                    expandParents(parentRow.parentId);
                }
            };
            
            // For each filtered row, expand its parents
            filteredRows.forEach(rowId => {
                const row = rows.find(r => r.id === rowId);
                if (row && row.parentId) {
                    expandParents(row.parentId);
                }
            });
        }
    }, [filteredRows, searchKeyword, rows]);

    return (
        <div className={style.table} ref={tableRef}>
            <div className={style.searchContainer}>
                <input 
                    className={style.searchInput}
                    placeholder="Search by key or value" 
                    name="search"
                    value={searchKeyword}
                    onChange={handleSearch}
                />
                {searchKeyword && (
                    <div className={style.searchStats}>
                        {filteredRows.length} {filteredRows.length === 1 ? 'match' : 'matches'} found
                    </div>
                )}
            </div>
            <div className={style.cells}>
                {rows.length < 1 ? (
                    <div className={style.empty}>There's no objects!</div>
                ) : (
                    renderRows(null)
                )}
            </div>
        </div>
    );
});

export default Table;