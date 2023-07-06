
import styles from "styles/Main.module.css";
import Link from "next/link.js";

export default function ThemeIcon({theme, i}){
    if (i == undefined) i = 0;
    return (
        <div key={"related-theme-" + theme.slug + Math.random()} className={styles.theme_icon_container + (i > 4 ? " " + styles.hide_on_mobile : "")}>
            <Link href={"/" + theme.slug}>
                <div className={styles.theme_icon} style={{backgroundImage: "url(\"/thumbnails/" + theme.slug + ".png\")"}}>
                </div>
                <div style={{maxWidth: "200px", minHeight: "50px"}}>{theme.name}</div>
            </Link>
        </div>
    );
}