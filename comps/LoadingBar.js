import styles from "styles/Main.module.css";


export default function LoadingBar({percentage}){
    return (
        <div className={styles.loading_bar_container}>
            <div className={styles.loading_bar_filled} style={{width: percentage + "%"}}>
            
            </div>
        </div>
    )
}