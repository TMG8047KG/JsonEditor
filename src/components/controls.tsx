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
      <label className={styles.toggleLabel} onClick={handleToggleKeyEditable}>
        <svg className={isKeyEditable ? styles.toggled : styles.untoggled} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
        </svg>
      </label>
    </div>
  );
}

export default Controls;