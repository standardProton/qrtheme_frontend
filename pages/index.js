import Head from "next/head.js";
import Image from "next/image";
import Link from "next/link";
import pagestyles from "styles/Home.module.css";
import styles from "styles/Main.module.css";
import Footer from "comps/Footer.js";
import { recommended } from "lib/themes";
import { getTheme } from "lib/theme_utils";
import ThemeIcon from "comps/ThemeIcon";

import { useState, useEffect } from "react";

export function getServerSideProps(context){
    return {
        props: {
            analytics: !process.env.DEV_ENV
        }
    }
}

export default function Index({analytics}){

    useEffect(() => {
        if (typeof window == "undefined") return;

        var b1 = document.getElementById("banner-1")
        if (b1 != null) b1.style.backgroundPosition = "center -544px"; //center -544px

        document.body.onscroll = function myFunction() {  
            var scrolltotop = document.scrollingElement.scrollTop;
            var yvalue = scrolltotop * 0.5;
            var target = document.getElementById("banner-1");
            if (target == null) return;
            var target2 = document.getElementById("banner-0");
            target.style.backgroundPosition = "center " + (yvalue - 564 + (window.innerWidth < 750 ? 500 : 0)) + "px"; //img height=1088px, // - 544
            target2.style.backgroundPosition = (-yvalue*0.25) + "px " + yvalue + "px";
        }
    })

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.png"></link>
                <title>Make Incredible QR Code Art with AI | QR Theme</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Get a unique AI QR Code for your business, event, profile, and more! Stand out to customers with a Scannable AI QR code."></meta>
                <meta name="og:image" content="/logo.png"></meta>
                {analytics && (<><script async src="https://www.googletagmanager.com/gtag/js?id=G-WBCYFDKWT3"></script>
                <script>{"window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-WBCYFDKWT3');"}</script></>)}
            </Head>
            <div className={styles.bg}></div>
            <div id="content">
                <div>
                    <div className={pagestyles.background_banner + " " + pagestyles.upper_banner} id="banner-0" style={{borderTop: "none"}}></div>
                    <div className={pagestyles.upper_container + " " + pagestyles.upper_banner_container}>
                        <center>
                            <Image src="/logo.png" width="308" height="172" alt="QR Theme"></Image>
                        </center>
                    </div>
                </div>
                <center>
                    <div style={{width: "75%"}}>
                        <div className={styles.rounded_box} style={{minHeight: "250px", marginTop: "60px", marginBottom: "60px"}}>
                            <span>Featured Themes</span>
                            <div className={styles.flexbox + " " + styles.centered}>
                                {recommended.slice(0, 4).map((id, i) => {
                                    const theme = getTheme(id);
                                    if (theme.error_msg != undefined) return (<></>);
                                    if (theme.name == "Underwater Coral Reef") theme.name = "Coral Reef";
                                    return (
                                    <ThemeIcon key={"recommended-theme-" + i} theme={theme}></ThemeIcon>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div style={{position: "relative"}}>
                        <div className={pagestyles.small_banner} id="banner-1" style={{height: "139px", backgroundImage: "url(\"/orange_bg_large.jpg\")"}}></div>
                        <div className={pagestyles.small_banner_container}>
                            <div className={styles.hide_on_mobile}>
                                <Image src="/get_seen_text.png" width="630" height="108" alt="Stand out with AI-Generated QR Codes"></Image>
                            </div>
                            <div className={styles.show_on_mobile} style={{fontSize: "14pt"}}>
                                <h2>Stand out with AI-Generated QR Codes</h2>
                            </div>
                        </div>
                    </div>
                    <div style={{width: "75%"}}>
                        <div className={styles.rounded_box} style={{minHeight: "200px", marginTop: "60px", fontSize: "18pt"}}>
                            {false && (<div style={{fontSize: "22pt"}}><span><b>Stand out with a themed QR Code</b></span></div>)}
                            <p style={{marginBottom: "50px"}}>Personalize your QR Codes to engage your customers with the power of Artificial Intelligence!
                                QR-Theme lets you generate amazing QR Codes in minutes!
                            </p>
                            <p style={{marginBottom: "50px"}}>
                                Installing AI software is time-consuming and requires high amounts of storage and computational power.
                                We made QR-Theme so that you can create QR Codes with the the best AI settings and increased scannability,
                                with no software installation required.
                            </p>
                            <p>
                                Use QR-Theme to create stunning visual QR Codes without the hassle!
                            </p>
                        </div>
                        <div className={pagestyles.bottom_link_container}>
                            <center>
                                <Link href="/themes">
                                    <span className={pagestyles.bottom_link}>Explore Themes</span>
                                    <Image src="/icons/right.png" width="22" height="22" alt="Right Arrow"></Image>
                                </Link>
                            </center>
                        </div>
                    </div>
                </center>
                <Footer></Footer>
            </div>
        </>
    );
}