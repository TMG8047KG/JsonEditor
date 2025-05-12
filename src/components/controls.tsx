import { documentDir } from '@tauri-apps/api/path';
import { open, save } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { useState } from 'react';
import styles from './styles/controls.module.css';

interface ControlsProps {
  onClearTable: () => void;
  onAddNestedRow: () => void;
  hasSelectedRow: boolean;
  onLoadData: (data: any) => void;
  onGetData: () => any;
  onToggleKeyEditable: () => void;
  onToggleValueEditable: () => void;
}

function Controls({ 
  onClearTable,
  onAddNestedRow,
  hasSelectedRow,
  onLoadData,
  onGetData,
  onToggleKeyEditable,
  onToggleValueEditable
}: ControlsProps) {
  const [isKeyEditable, setIsKeyEditable] = useState<boolean>(true);
  const [isValueEditable, setIsValueEditable] = useState<boolean>(true);

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

  const handleToggleKeyEditable = () => {
    setIsKeyEditable(prev => !prev);
    onToggleKeyEditable();
  };

  const handleToggleValueEditable = () => {
    setIsValueEditable(prev => !prev);
    onToggleValueEditable();
  };

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={openFile}>Open File</button>
        {hasSelectedRow && (
          <button className={styles.button} onClick={onAddNestedRow}>
            Make list
          </button>
        )}
        <button className={styles.button} onClick={onClearTable}>Clear Table</button>
        <button className={styles.button} onClick={saveFile}>Save File</button>
      </div>
      
      <div className={styles.togglesContainer}>
        <div className={styles.toggleWrapper}>
          <label className={styles.toggleLabel}>
            <span>Key Editable:</span>
            <div 
              className={`${styles.toggle} ${isKeyEditable ? styles.toggleOn : styles.toggleOff}`}
              onClick={handleToggleKeyEditable}
            >
              <div className={styles.toggleSlider}></div>
            </div>
          </label>
        </div>
        <div className={styles.toggleWrapper}>
          <label className={styles.toggleLabel}>
            <span>Value Editable:</span>
            <div 
              className={`${styles.toggle} ${isValueEditable ? styles.toggleOn : styles.toggleOff}`}
              onClick={handleToggleValueEditable}
            >
              <div className={styles.toggleSlider}></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Controls;