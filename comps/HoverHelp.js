
import { useState } from "react"
import Image from "next/image.js";
import styles from "styles/Main.module.css";

export default function HoverHelp({text}){
    const [visible, setVisible] = useState(false);

    return (
        <div style={{position: "relative", padding: "5px", paddingTop: "0", cursor: "pointer"}} onMouseOver={() => setVisible(true)} onMouseOut={() => setVisible(false)} onClick={() => {if (window.innerWidth <= 800) setVisible(!visible)}}>
            {visible && (<div className={styles.hover_help_text} style={text.length <= 27 ? {width: "220px", left: "-110px"} : {}}>
                {text}
            </div>)}
            <Image src="/help.png" width="19" height="19" alt="?"></Image>
        </div>
    )
}