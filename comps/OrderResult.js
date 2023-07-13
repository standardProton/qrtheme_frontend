import styles from "styles/Main.module.css";
import { useState, useEffect } from "react";
import Image from "next/image.js";
import Link from "next/link.js";
import ImageScroll from "./ImageScroll";

export default function OrderResult({order, past_order, size}){
    const [hidden, setHidden] = useState(past_order);
    const [view_index, setViewIndex] = useState(-1);
    const [src_list, setSourceList] = useState([]);

    const url_base = "https://qr-theme-image.s3.us-east-2.amazonaws.com/";
    const name_prefix = "QR_Theme_";

    const id = order.order_id;

    if (size > 400) size = 5*size/6.0;

    useEffect(() => {

        const newsrc_list = [];
        for (let j = 0; j < order.images.length; j++) newsrc_list.push(url_base + "order-" + id + "/" + name_prefix + order.images[j] + ".jpg");
        setSourceList(newsrc_list);

        if(newsrc_list.length < 10) {
            var updating = true;
            const iid = setInterval(async () => {
                if (updating){
                    const res1 = await fetch("/api/v1/check_orders?order_id=" + id);
                    if (res1.status == 200){
                        const order_ref = await res1.json();
                        if (order_ref.output == undefined) {
                            console.error("Could not refresh order images: undefined");
                            return;
                        }
                        
                        const refreshed_src = [];
                        const images = order_ref.output.split(" ").filter(name => name.length > 0);
                        for (let j = 0; j < images.length; j++) refreshed_src.push(url_base + "order-" + id + "/" + name_prefix + images[j] + ".jpg");
                        setSourceList(refreshed_src);
                        if (refreshed_src.length >= 10) updating = false;

                    }
                }
            }, 4000);
            return () => clearInterval(iid);
        }
    }, [order])

    return (
        <div key={"order-result-" + id} style={{textAlign: "left"}}>
            {hidden ? (<div onClick={() => {
                setViewIndex(-1);
                setHidden(false);
            }} style={{display: "flex", cursor: "pointer", marginTop: "10px", marginBottom: "10px"}}>
                <Image src="/icons/right.png" width="24" height="24" alt="Right Arrow" style={{marginRight: "8px"}}></Image>
                <div style={{fontSize: "20pt"}}>
                    <b>{order.qr_url}</b>
                </div>
            </div>) :
            (
                <>
                {view_index < 0 ? (
                <>
                {src_list.length > 0 && (<div onClick={() => {if (past_order) setHidden(true)}} style={{marginTop: "10px", marginBottom: "10px", display: "flex"}}>
                    {past_order && (<Image src="/icons/down.png" width="24" height="24" alt="Down Arrow"></Image>)}
                    <span style={{cursor: past_order ? "pointer" : "inherit", marginLeft: "8px", fontSize: "20pt"}}><b>{order.qr_url}</b></span>
                </div>)}
                <div className={styles.flexbox} style={{justifyContent: "center", alignItems: "center", textAlign: "center"}}>
                    {src_list.map((image, j) => {
                        return (
                            <div className={styles.theme_icon} style={{cursor: "pointer", backgroundImage: "url(\"" + image + "\")"}}
                            onClick={() => {setViewIndex(j)}} key={"image-gen-icon-" + j}></div>
                        )
                    })}
                </div>
                {src_list.length < 10 && (
                    <div>
                        <center>
                            <div style={{margin: "10px"}}><span>{"Generating " + (10 - src_list.length) + 
                            (src_list.length > 0 ? " More" : "") + " Image" + (src_list.length == 9 ? "" : "s") + "..."}</span></div>
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