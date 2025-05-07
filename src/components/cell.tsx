import style from './styles/cell.module.css'

function cell({ name, val }: {name: string; val: string|number}){
    return(
        <div className={style.content}>
            <span contentEditable className={style.key}>{name}</span>
            <span contentEditable className={style.value}>{val}</span>
        </div>
    )
}

export default cell;