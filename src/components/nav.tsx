import { Window } from '@tauri-apps/api/window';
import style from "./styles/nav.module.css"

function navbar(){

    const handleClose = async () => {
        const currentWindow = await Window.getCurrent();
        currentWindow.close();
    };

    const handleMaximize = async () => {
        const currentWindow = await Window.getCurrent();
        console.log(await currentWindow.isMaximized());
        
        if(await currentWindow.isMaximized()){
            currentWindow.unmaximize()
        }else{
            currentWindow.maximize();
        }
    };

    const handleMinimize = async () => {
        const currentWindow = await Window.getCurrent();
        currentWindow.minimize();
    };

    return(
        <div className={style.container} data-tauri-drag-region>
            <h1 className={style.title}>JsonEditor</h1>
            <div>
                <button className={style.button} onClick={handleMaximize}>☐</button>
                <button className={style.button} onClick={handleMinimize}>_</button>
                <button className={style.button} onClick={handleClose}>X</button>
            </div>
            
        </div>
    )
}

export default navbar;