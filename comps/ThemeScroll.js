
import ThemeIcon from "comps/ThemeIcon.js";
import styles from "styles/Main.module.css";

export default function ThemeScroll({category}){
    if (category == undefined) return (<></>);

    return (
        <div className={styles.rounded_box}>
            <div style={{textAlign: "left", fontSize: "20pt"}}>
                {category.name}
            </div>
            <div style={{display: "flex", overflowX: "auto"}}>
                {category.themes.map(theme => (
                    <ThemeIcon key={"theme-" + theme.slug + Math.random()} theme={theme}></ThemeIcon>
                ))}
            </div>
        </div>
    )
}