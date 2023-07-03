import Head from "next/head.js";
import Image from "next/image";
import Link from "next/link";
import pagestyles from "styles/Home.module.css";
import styles from "styles/Main.module.css";
import Footer from "comps/Footer.js";

import { useState } from "react";

/*export function getServerSideProps(context){
    return {
        props: {
            recommended_themes:[
                {text: "Theme 1", slug: "theme1"}
            ]
        }
    }
}*/

export default function Index(){


    useState(() => {
        if (typeof window == "undefined") return;

        var b1 = document.getElementById("banner-1")
        if (b1 != null) b1.style.backgroundPosition = "center -544px";

        document.body.onscroll = function myFunction() {  
            var scrolltotop = document.scrollingElement.scrollTop;
            var yvalue = scrolltotop * 0.5;
            var target = document.getElementById("banner-1");
            if (target == null) return;
            var target2 = document.getElementById("banner-0");
            target.style.backgroundPosition = "center " + (yvalue - 544) + "px"; //img height=1088px
            target2.style.backgroundPosition = (-yvalue*0.25) + "px " + yvalue + "px";
        }
    })

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.png"></link>
                <title>Make Incredible AI-Generated QR Code Art | QR Scene</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Get a unique AI QR Code for your business, event, profile, and more! Stand out to customers with a Scannable AI QR code."></meta>
                <meta name="og:image" content="/logo.png"></meta>
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
                        <div className={styles.rounded_box} style={{height: "250px", marginTop: "60px", marginBottom: "60px"}}>
                            <span>Featured Themes</span>
                        </div>
                    </div>
                    <div style={{position: "relative"}}>
                        <div className={pagestyles.small_banner} id="banner-1" style={{height: "139px", backgroundImage: "url(\"/orange_bg_large.jpg\")"}}></div>
                        <div className={pagestyles.small_banner_container}>
                            <div className={styles.hide_on_mobile}>
                                <Image src="/get_seen_text.png" width="630" height="108" alt="Get Seen with AI-Generated QR Codes"></Image>
                            </div>
                            <div className={styles.show_on_mobile} style={{fontSize: "15pt"}}>
                                <h2>Get Seen with AI-Generated QR Codes</h2>
                            </div>
                        </div>
                    </div>
                    <div style={{width: "75%"}}>
                        <div className={styles.rounded_box} style={{minHeight: "200px", marginTop: "60px"}}>
                            {false && (<div style={{fontSize: "20pt"}}><span><b>Stand out with a themed QR Code</b></span></div>)}
                            <p>Personalize your QR Codes to engage your customers with the power of Artificial Intelligence!
                                QR-Theme provides the best AI settings and automatically generates the image for you!
                            </p>
                            <p>
                                QR-Theme integrates the design into the shape of the QR Code. For example, in<Link style={{color: "#0f88e4"}} target="_blank" href="/flower-vase"> this</Link> QR code, the flowers
                                form the shape of the encoded information. This is a step above other AI models, which only put black boxes
                                over the image.
                            </p>
                        </div>
                        <div className={pagestyles.bottom_link_container}>
                            <center>
                                <Link href="/themes">
                                    <span className={pagestyles.bottom_link}>Explore Themes</span>
                                    <Image src="/right.png" width="22" height="22" alt="Right Arrow"></Image>
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