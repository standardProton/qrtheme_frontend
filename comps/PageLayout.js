import styles from "styles/Main.module.css";
import { useEffect, useState } from "react";
import MenuBar from "comps/MenuBar.js";
import Head from "next/head.js";
import Footer from "comps/Footer.js";

export default function PageContainer({title, description, user, children}){

    const [menubar, setMenuBar] = useState(<MenuBar user={user} mobile={0}></MenuBar>);
    const [small_menubar, setMenuBarSize] = useState(false);
    function updateMenu(){
        if (window.innerWidth < 900 && !small_menubar){
            setMenuBar(<MenuBar user={user} mobile={1}></MenuBar>);
            setMenuBarSize(true);
        } else if (window.innerWidth > 900 && small_menubar){
            setMenuBar(<MenuBar user={user} mobile={0}></MenuBar>);
            setMenuBarSize(false);
        }
    }

    useEffect(() => {
        window.addEventListener("resize", updateMenu);
        updateMenu();

        return () => {
            window.removeEventListener("resize", updateMenu);
        }
    });
    
    const desc = description == null ? "Get a unique AI QR Code for your business, event, profile, and more! Stand out to customers with a Scannable AI QR code." : description;

    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.png"></link>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content={desc}></meta>
                <meta name="og:image" content="/logo.png"></meta>
            </Head>
            <div className={styles.bg}>
            </div>
            <div className={styles.content}>
                {menubar}
                <div className={styles.content_container}>
                    <center>
                        <div style={{width: "75%"}}>
                            {children}
                        </div>
                    </center>
                </div>
                <Footer></Footer>
            </div>
        </>
    )
}