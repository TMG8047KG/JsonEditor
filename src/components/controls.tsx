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
        <button className={styles.button} onClick={openFile}>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
          </svg>
        </button>
        {hasSelectedRow && (
          <button className={styles.button} onClick={onAddNestedRow}>
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v14m-8-7h2m0 0h2m-2 0v2m0-2v-2m12 1h-6m6 4h-6M4 19h16c.5523 0 1-.4477 1-1V6c0-.55228-.4477-1-1-1H4c-.55228 0-1 .44772-1 1v12c0 .5523.44772 1 1 1Z"/>
            </svg>
          </button>
        )}
        <button className={styles.button} onClick={onClearTable}>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
          </svg>
        </button>
        <button className={styles.button} onClick={saveFile}>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M11 16h2m6.707-9.293-2.414-2.414A1 1 0 0 0 16.586 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7.414a1 1 0 0 0-.293-.707ZM16 20v-6a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v6h8ZM9 4h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4Z"/>
          </svg>
        </button>
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