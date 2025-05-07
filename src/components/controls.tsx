import { documentDir } from '@tauri-apps/api/path';
import { open, save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import styles from './styles/controls.module.css';

interface ControlsProps {
  onAddRow: () => void;
  onRemoveRow: () => void;
  onClearTable: () => void;
}

function Controls({ onAddRow, onRemoveRow, onClearTable }: ControlsProps) {
  const openFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        directory: false,
        title: "Select Json File",
        defaultPath: await documentDir(),
        filters: [
          {
            name: "Json file",
            extensions: ['json']
          }
        ]
      });
      
      if (selected) {
        console.log("Selected file:", selected);
        // Here you would implement loading the JSON into the table
        // You would need to add a loadData method to the TableHandle
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const saveFile = async () => {
    try {
      const filePath = await save({
        defaultPath: await documentDir(),
        filters: [
          {
            name: "Json file",
            extensions: ['json']
          }
        ]
      });
      
      if (filePath) {
        // Here you would implement getting the data from the table
        // and saving it to the file
        const dummyData = JSON.stringify({ sample: "data" }, null, 2);
        await writeTextFile(filePath, dummyData);
        console.log("File saved at:", filePath);
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  return (
    <div className={styles.buttons}>
      <button className={styles.button} onClick={openFile}>Open File</button>
      <button className={styles.button} onClick={onAddRow}>Add Row</button>
      <button className={styles.button} onClick={onRemoveRow}>Remove Row</button>
      <button className={styles.button} onClick={onClearTable}>Clear Table</button>
      <button className={styles.button} onClick={saveFile}>Save File</button>
    </div>
  );
}

export default Controls;