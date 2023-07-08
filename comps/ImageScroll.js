
import { useState } from "react"
import Image from "next/image.js";
import styles from "styles/Main.module.css";

export default function ImageScroll({src_list, blur_list, width, height, alt, view_index, setViewIndex}){

    if (view_index == undefined || setViewIndex == undefined){
        console.log("Error: Undefined view_index in ImageScroll component.");
        return (<></>);
    }

    return (
        <>
        <div className={styles.qr_preview} id="qr-preview" style={{width: width + "px", height: height + "px"}}>
            {blur_list == undefined ? (<Image src={src_list[view_index]} width={width} height={height} alt={alt}></Image>) : 
            (<Image src={src_list[view_index]}
            width={width} height={height} alt={alt}
            placeholder="blur" blurDataURL={blur_list[view_index]}></Image>)}
        </div>
        {src_list.length > 0 && (<div style={{marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
            <div onClick={() => {
                console.log("left");
                if (view_index <= 0) setViewIndex(src_list.length - 1);
                else setViewIndex(view_index - 1);
            }} style={{cursor: "pointer", marginTop: "5px"}}>
                <Image src="/icons/left.png" width="24" height="24" alt="Left Arrow"></Image>
            </div>
            <div style={{marginLeft: "15px", marginRight: "15px"}}>
                {(view_index + 1) + " / " + src_list.length}
            </div>
            <div onClick={() => {
                if (view_index >= src_list.length - 1) setViewIndex(0);
                else setViewIndex(view_index + 1);
            }} style={{cursor: "pointer", marginTop: "5px"}}>
                <Image src="/icons/right.png" width="24" height="24" alt="Right Arrow"></Image>
            </div>
        </div>)}
        </>
    )

}