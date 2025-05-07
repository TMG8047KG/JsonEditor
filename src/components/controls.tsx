import { BaseDirectory, documentDir } from '@tauri-apps/api/path';
import { open, save } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import styles from './styles/controls.module.css';

interface ControlsProps {
  onAddRow: () => void;
  onRemoveRow: () => void;
  onClearTable: () => void;
  onAddNestedRow: () => void;
  onRemoveSelectedRow: () => void;
  hasSelectedRow: boolean;
  onLoadData: (data: any) => void;
  onGetData: () => any;
}

function Controls({ 
  onAddRow, 
  onRemoveRow, 
  onClearTable,
  onAddNestedRow,
  onRemoveSelectedRow,
  hasSelectedRow,
  onLoadData,
  onGetData
}: ControlsProps) {
  const openFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        directory: false,
        title: "Select JSON File",
        defaultPath: await documentDir(),
        filters: [
          {
            name: "JSON file",
            extensions: ['json']
          }
        ]
      });
      
      if (selected && !Array.isArray(selected)) {
        console.log("Selected file:", selected);
        
        try {
          // Read the file content
          const content = await readTextFile(selected);
          
          // Parse the JSON
          const jsonData = JSON.parse(content);
          
          // Load the data into the table
          onLoadData(jsonData);
        } catch (parseError) {
          console.error("Error parsing JSON file:", parseError);
          // You could add a user-facing error message here
          alert("Error parsing JSON file. Please make sure it's valid JSON.");
        }
      }
    } catch (error) {
      console.error("Error opening file:", error);
      alert("Error opening file. Please try again.");
    }
  };

  const saveFile = async () => {
    try {
      const filePath = await save({
        defaultPath: await documentDir(),
        filters: [
          {
            name: "JSON file",
            extensions: ['json']
          }
        ]
      });
      console.log(filePath);
      
      if (filePath) {
        // Get the data from the table
        const data = onGetData();
        
        // Convert to JSON string with nice formatting
        const jsonString = JSON.stringify(data, null, 2);
        
        // Write to file
        await writeTextFile(filePath, jsonString);
        console.log("File saved at:", filePath);
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Error saving file. Please try again.");
    }
  };

  return (
    <div className={styles.buttons}>
      <button className={styles.button} onClick={openFile}>Open File</button>
      <button className={styles.button} onClick={onAddRow}>Add Row</button>
      {hasSelectedRow && (
        <button className={styles.button} onClick={onAddNestedRow}>
          Add Nested Row
        </button>
      )}
      <button 
        className={styles.button} 
        onClick={hasSelectedRow ? onRemoveSelectedRow : onRemoveRow}
      >
        {hasSelectedRow ? 'Remove Selected' : 'Remove Row'}
      </button>
      <button className={styles.button} onClick={onClearTable}>Clear Table</button>
      <button className={styles.button} onClick={saveFile}>Save File</button>
    </div>
  );
}

export default Controls;