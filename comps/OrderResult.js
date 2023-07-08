import styles from "styles/Main.module.css";
import { useState } from "react";
import Image from "next/image.js";
import Link from "next/link.js";
import ImageScroll from "./ImageScroll";
import ThemeIcon from "./ThemeIcon";

export default function OrderResult({order, i, size}){
    const [hidden, setHidden] = useState(i > 0);
    const [view_index, setViewIndex] = useState(-1);

    const url_base = "https://qr-theme-image.s3.us-east-2.amazonaws.com/";
    const name_prefix = ""; //"QR_Theme_";

    const src_list = [];
    for (let j = 0; j < order.images.length; j++) src_list.push(url_base + "order-" + order.order_id + "/" + name_prefix + order.images[j] + ".jpg");

    if (size > 400) size = 5*size/6.0;

    return (
        <div key={"order-result-" + order.id} style={{textAlign: "left"}}>
            {hidden ? (<></>) :
            (
                <>
                {view_index < 0 ? (
                <>
                <div style={{marginTop: "10px", marginBottom: "10px"}}>
                    <span style={{cursor: "pointer", fontSize: "20pt"}}><b>{order.qr_url}</b></span>
                </div>
                <div className={styles.flexbox} style={{justifyContent: "center", alignItems: "center", textAlign: "center"}}>
                    {order.images.map((image, j) => {
                        const img_url = url_base + "order-" + order.order_id + "/" + name_prefix + image + ".jpg";
                        return (
                        <div className={styles.theme_icon} style={{cursor: "pointer", backgroundImage: "url(\"" + img_url + "\")"}}
                        onClick={() => {setViewIndex(j)}} key={"image-gen-icon-" + j}></div>
                        )
                    })}
                </div>
                {order.images.length < 10 && (
                    <div>
                        <center>
                            <div style={{margin: "10px"}}><span>{"Generating " + (10 - order.images.length) + 
                            (order.images.length > 0 ? " More" : "") + " Image" + (order.images.length == 9 ? "" : "s") + "..."}</span></div>
                            <Image src="/loading.gif" height="40" width="40" alt="Loading"></Image>
                        </center>
                    </div>
                )}
                </>) :
                (<div key={"image-downlaod-view-" + view_index}>
                    <div style={{marginTop: "15px"}}>
                        <div className={styles.flexbox + " " + styles.centered}>
                            <div style={{marginRight: "15px"}}>
                                <ImageScroll src_list={src_list} width={size} height={size} starting_index={view_index} alt={"QR Theme Image Download"} view_index={view_index} setViewIndex={setViewIndex}></ImageScroll>
                                <center style={{margin: "20px"}}>
                                    <Link href={src_list[view_index]}>
                                        <div className={styles.styled_button + " " + styles.gray_button} style={{width: "300px"}}>
                                            <Image src="/icons/download.png" height="23" width="23" alt="Download"></Image>
                                            <span style={{marginLeft: "10px", fontSize: "18pt"}}>Download</span>
                                        </div>
                                    </Link>
                                </center>
                            </div>
                        </div>
                        <center>
                            <div style={{cursor: "pointer", marginTop: "15px"}} onClick={() => setViewIndex(-1)}>View All</div>
                        </center>
                    </div>
                </div>)}
                </>
            )}
        </div>
    )
}