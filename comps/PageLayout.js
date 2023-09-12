import styles from "styles/Main.module.css";
import { useEffect, useState } from "react";
import MenuBar from "comps/MenuBar.js";
import Head from "next/head.js";
import Footer from "comps/Footer.js";

export default function PageContainer({title, description, user, theme_slug, analytics, children}){

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
                <link rel="icon" type="image/png" href="/favicon.png"></link>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content={desc}></meta>
                {theme_slug != undefined && (<meta name="og:image" content={"/thumbnails/" + theme_slug + ".png"}></meta>)}
                {analytics && (<><script async src="https://www.googletagmanager.com/gtag/js?id=G-WBCYFDKWT3"></script>
                <script>{"window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-WBCYFDKWT3');"}</script></>)}
            </Head>
            <div className={styles.bg}>
            </div>
            <div className={styles.content}>
                {menubar}
                <div className={styles.content_container}>
                    <center>
                        <div className={styles.content_width}>
                            {children}
                        </div>
                    </center>
                </div>
                <Footer></Footer>
            </div>
        </>
    )
}