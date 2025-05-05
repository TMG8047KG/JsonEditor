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
            <h1 className={style.title} data-tauri-drag-region>logo</h1>
            <div className={style.buttons}>
                <button className={style.button} onClick={handleMinimize}>
                    <img src='src\assets\minimize.png' width='24'/>
                </button>
                <button className={style.button} onClick={handleMaximize}>
                    <img src='src\assets\maximize.png' width='24'/>
                </button>
                <button className={style.button} onClick={handleClose}>
                    <img src='src\assets\close.png' width='24'/>
                </button>
            </div>
            
        </div>
    )
}

export default navbar;