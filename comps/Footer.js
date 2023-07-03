import styles from "styles/Main.module.css";
import Image from "next/image.js";
import Link from "next/link.js";

export default function Footer(){
    const links =[
        {text: "Explore", href: "/themes"},
        {text: "Terms & Privacy", href: "/terms"},
        {text: "Contact", href: "mailto:support@qr-scene.com"},
        {text: "Suggest a Theme!", href: "/suggest"}
    ]
    return(
        <div>
            <div style={{backgroundColor: "#FFF", width: "100%", height: "5px", marginTop: "30px"}}></div>
            <div className={styles.footer_content}>
                <center>
                    <div style={{marginTop: "20px"}}>
                        <Image src="/logo.png" alt="QR Scene" height={97} width={173}></Image>
                    </div>
                    <center>
                    <div className={styles.flexbox} style={{alignItems: "center", justifyContent: "center"}}>
                        <>
                        {links.map(link => (
                            <div className={styles.footer_link} key={"footer-" + link.href}>
                                <Link href={link.href}>{link.text}</Link>
                            </div>
                        ))}
                        </>
                    </div>
                    </center>
                </center>
            </div>
        </div>
    )
}