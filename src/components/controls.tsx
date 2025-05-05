import { documentDir } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';
import styles from './styles/controls.module.css'

function controls() {
    const openFile = async () => {
        const file = open({
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
        })
        console.log(file);
    }
    return(
        <div className={styles.buttons}>
            <button className={styles.button} onClick={openFile}>Open File</button>
            <button className={styles.button}>Add Row</button>
            <button className={styles.button}>Remove Row</button>
            <button className={styles.button}>Clear Table</button>
            <button className={styles.button}>Save File</button>
        </div>
    )
}

export default controls;