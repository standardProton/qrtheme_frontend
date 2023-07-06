import Image from "next/image.js";
import styles from "styles/Main.module.css";
import Link from "next/link.js"
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";

//#0f9afe

export default function MenuBar({mobile, user}){
    const menulinks = [
        {url: "/themes", text: "Explore Themes", action: 0},
        {url: "/", text: "Why QR Theme?", action: 0},
        user == null ? {url: "/login", text: "Log In", action: 1} : {url: "/login", text: "Log Out", action: 2}
    ];

    const mobile_menu_closed = (
        <div style={{margin: "20px", marginBottom: "0", padding: "10px"}} onClick={() => setMobileMenu(mobile_menu_display)}>
            <Image src="/icons/mobile_menu_lt.png" height={32} width={32} alt="Menu"></Image>
        </div>
    );

    const mobile_menu_display = (
        <>
            <div style={{margin: "32px", marginBottom: "0"}}>
                <Image src="/icons/close_lt.png" onClick={() => setMobileMenu(mobile_menu_closed)} height={24} width={24} alt="Close"></Image>
            </div>
            <div style={{position: "absolute", width: "100vh", height: "100vh"}} onClick={() => setMobileMenu(mobile_menu_closed)}>
                <div style={{top: "90px", right: "10px", position: "absolute"}}>
                    <div className={styles.header_mobile_menu}>
                        {menulinks.map(linkdata => {
                            var action = () => {}
                            if (linkdata.action == 1) action = signIn;
                            else if (linkdata.action == 2) action = signOut;

                            if (linkdata.action > 0){
                                return (<div onClick={() => action()} key={"link-" + linkdata.text} className={styles.header_mobile_link_container}>
                                    <div className={styles.header_mobile_link}>{linkdata.text}</div>
                                </div>);
                            }
                            else return (
                            <div key={"link-" + linkdata.text} className={styles.header_mobile_link_container}>
                                <Link href={linkdata.url}>
                                    <div className={styles.header_mobile_link}>{linkdata.text}</div>
                                </Link>
                            </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );

    const [mobile_menu, setMobileMenu] = useState(mobile_menu_closed);

    return (
        <>
            <div className={styles.shadow + " " + styles.header_bg}>
                <div style={{display: "flex"}}>
                    <div style={{marginLeft: "30px", marginTop: "10px", marginBottom: "5px"}}>
                        <Link href="/">
                            <Image src="/logo.png" alt="QR Scene" height={97} width={173}></Image>
                        </Link>
                    </div>
                    <div className={styles.header_links}>
                        {mobile == 0 || mobile == undefined ? (
                            <>
                                {menulinks.map(linkdata => {
                                    var action = () => {}
                                    if (linkdata.action == 1) action = signIn;
                                    else if (linkdata.action == 2) action = signOut;

                                    if (linkdata.action > 0){
                                        return (
                                            <div onClick={() => action()} className={styles.header_link_container} key={"header-link-" + linkdata.text}>
                                                <div className={styles.header_link}>{linkdata.text}</div>
                                            </div>
                                        );
                                    }

                                    else return (
                                    <div className={styles.header_link_container} key={"header-link-" + linkdata.text}>
                                        <Link href={linkdata.url}>
                                            <div className={styles.header_link}>{linkdata.text}</div>
                                        </Link>
                                    </div>
                                    );
                                })}
                            </>
                        ) : (
                            <>
                                {mobile_menu}
                            </>
                        )}
                    </div>
                </div>
                {false && (<div style={{background: "linear-gradient(90deg, #0f9afe 0%, rgba(171, 125, 255) 100%)", width: "100%", height: "6px"}}></div>)}
            </div>
        </>
    );
}