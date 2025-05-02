import { useState } from "react";
import styles from './styles/editor.module.css'

function editor(){
    const [rows, setRows] = useState([{ key: '', value: '' }]);

    return (
        <div className={styles.wrapper}>
        <h1 className={styles.title}>JSON Reader</h1>
        <div className={styles.container}>
          <table className={styles.jsonTable}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={row.key}
                      placeholder="Name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.value}
                      placeholder="Value"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
}

export default editor;