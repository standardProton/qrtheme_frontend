
import PageLayout from "comps/PageLayout.js"
import styles from "styles/Main.module.css";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from '@stripe/stripe-js';
import Error404 from "comps/Error404.js";
import {shuffleArray, getConnection, mysqlQuery } from "lib/utils.ts";
import { relatedThemes, getThemeSlug, getOrders } from "lib/theme_utils";
import ErrorPage from "comps/ErrorPage";
import { useState, useEffect } from "react";
import { getServerSession } from "next-auth";
import { getEmailUser } from "lib/auth_utils";
import { useRouter } from "next/router";
import {signIn} from "next-auth/react";
import { authOptions } from "pages/api/auth/[...nextauth].js";
import ThemeIcon from "comps/ThemeIcon";
import OrderResult from "comps/OrderResult";
import { useRef } from "react";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export async function getServerSideProps(context){
    if (context == undefined || context.query == undefined || context.query.theme == undefined){
        return {props: {context: {error404: true, error_msg: "'Theme' parameter is undefined!"}}}
    }

    const session = await getServerSession(context.req, context.res, authOptions);

    const slug = context.query.theme;

    const themedata = getThemeSlug(slug);

    if (themedata.error_msg != undefined){
        return {props: {context: themedata}}
    }

    const themes = relatedThemes(themedata);

    //createThemesList(con);

    const related_themes = shuffleArray(themes).slice(0, 8);

    const con = await getConnection();
    //if (con == null) return {props: {context: {error404: false, error_msg: "Could not connect to the server!"}}}
    
    var user = null;
    var orders = [];
    if (con != null) {
        user = await getEmailUser(session, con);
        if (user != null){
            if (user.banned) return {props: {context: {error404: false, error_msg: "You are banned!"}}}

            orders = await getOrders(con, user.id, themedata.id);

        }

        con.end();
    }

    return {props: {context: {theme: themedata, related_themes}, user, orders}}
}

export default function ThemePreview({context, user, orders}){

    const [size, setSize] = useState(1);
    const [qr_url_error, setQRError] = useState(null);
    const [submit_error, setSubmitError] = useState(null);
    const [page_setup, setPageSetup] = useState(false);
    const [image_size, setImageSize] = useState(100);

    const small_price = 2.99;
    const med_price = 5.99;
    const large_price = 6.99;

    const router = useRouter();
	const { payment_success, payment_cancelled, awaiting_images } = router.query;

    useEffect(() => {
        if (context == undefined) return;

        const resize = () => {
            const pixels = Math.trunc(Math.min(window.innerWidth * ((window.innerWidth >= 1075 && window.innerWidth <= 1400) ? 0.4 : 0.55), 600));
            setImageSize(pixels);
        }

        if (!page_setup){
            setPageSetup(true);
            const url_input = document.getElementById("url-input");
            if (url_input != null){
                url_input.addEventListener("input", () => {
                    if (url_input.value.length >= 50){
                        setQRError("This URL is too long! Use a link shortener");
                        return;
                    }else{
                        setQRError(null);
                    }
                })
            }

            if (payment_success){
                alert("Order placed!");
            }

            //const qr = document.getElementById("qr-preview");
            //const qr_image = document.getElementById("preview-image");
            if (window != null){
                window.addEventListener("resize", () => resize());
                resize();
            }

        }
        resize();

    }, [page_setup])
    
    const order_wait = useRef();

    useEffect(() => {
        if (awaiting_images && order_wait.current != undefined) order_wait.current.scrollIntoView({behavior: "smooth", block: "start"});
    }, [awaiting_images]);


    async function createOrder(){
        const url_input = document.getElementById("url-input").value;
        if (url_input.length == 0){
            setQRError("Enter the URL for the QR code!");
            return;
        } else if (url_input.length >= 60){
            setQRError("This URL is too long! Use a link shortener");
            return;
        }

        if (context == undefined || context.theme == undefined || context.theme.id == undefined){
            alert("Undefined theme data!");
            return;
        }

        const res = await fetch("/api/stripe/checkout_session", {
            method: "POST",
            body: JSON.stringify({
                theme_slug: context.theme.slug,
                size,
                url_text: url_input,
            })
        });        

        const j = await res.json();
        if (j.error_msg != undefined) setSubmitError(j.error_msg);
        else if (j.redirect_url) router.push(j.redirect_url);
        else router.push("/" + context.theme.slug + "?awaiting_images=true");
    }

    if (context == undefined) return (<></>); //TODO
    

    if (context.error_msg != undefined){
        if (context.error404 != undefined && context.error404) return (<Error404></Error404>)
        else return (<ErrorPage msg={context.error_msg}></ErrorPage>);
    }

    const theme = context.theme;
    const related_themes = context.related_themes;

    return (
        <PageLayout title={theme.name + " QR Codes | Generate AI QR Codes | QR Theme"} user={user}>
            <center>
                <div className={styles.flexbox} style={{width: "100%", height: "100%"}}>
                    <div className={styles.rounded_box + " " + styles.main_panel}>
                        <div className={styles.qr_preview} id="qr-preview" style={{width: image_size + "px", height: image_size + "px"}}>
                            {/*style={{backgroundImage: "url(\"/themes/" + theme.slug + ".png\")"}}*/}
                            <Image src={"/themes/" + theme.slug + ".png"} id="preview-image" 
                            width={image_size} height={image_size} alt={theme.name + " QR Code"}
                            placeholder="blur" blurDataURL={"/thumbnails/" + theme.slug + ".png"}></Image>
                        </div>
                    </div>
                    <div className={styles.rounded_box + " " + styles.side_panel}>
                        <div><b>{theme.name}</b></div>
                        <div className={styles.theme_description}>{theme.description}</div>
                        <hr></hr>
                        <input maxLength="60" id="url-input" className={styles.input} placeholder="QR Code URL"></input>
                        {qr_url_error != null && (<div style={{fontSize: "14pt", color: "#f43131"}}>{qr_url_error}</div>)}
                        <div className={styles.flexbox + " " + styles.multiselect_container}>
                            <div className={size == 0 ? styles.multiselect_selected : styles.multiselect_option} onClick={() => {setSize(0)}}>Small</div>
                            <div className={size == 1 ? styles.multiselect_selected : styles.multiselect_option} onClick={() => {setSize(1)}}>Large</div>
                            <div className={size == 2 ? styles.multiselect_selected : styles.multiselect_option} onClick={() => {setSize(2)}}>XL</div>
                        </div>
                        <div style={{color: "#a1a1a1", fontSize: "14pt", marginTop: "10px", marginBottom: "150px"}}>
                            <div>10 Images</div>
                            {size == 0 && (<div>512x512 Pixels</div>)}
                            {size == 1 && (<div>2048x2048 Pixels</div>)}
                            {size == 2 && (<div>4096x4096 Pixels</div>)}
                            <div>Guaranteed Scannability</div>
                        </div>
                        <div style={{position: "absolute", width: "100%", left: "5%", bottom: "15px"}}>
                            {user == null ? (<div style={{color: "#838383", fontSize: "14pt", width: "85%", marginBottom: "6px"}}>You must be logged in to create a QR Code</div>) :
                            (
                                <div className={styles.pricebar}>
                                    <div style={{fontSize: "18pt"}}>
                                        <b>Total:</b>
                                    </div>
                                    <div style={{fontSize: "14pt", paddingTop: "2px"}}>
                                        <div>
                                            <span style={{textDecoration: user.free_images > 0 ? "line-through" : "inherit"}}>{"USD $" + (size < 2 ? (size == 0 ? small_price : med_price) : large_price)}</span>
                                            {user.free_images > 0 && (<span style={{color: "#09fa21"}}> FREE</span>)}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div onClick={() => {user == null ? signIn() : createOrder(user)}}className={styles.styled_button + " " + styles.blue_button}>
                                <span>{user == null ? "Sign In" : "Generate"}</span>
                            </div>
                            <div style={{textAlign: "center", width: "90%"}}>
                                {submit_error != null && (<span style={{color: "#f43131", fontSize: "14pt"}}>{submit_error}</span>)}
                            </div>
                            <div style={{textAlign: "center", width: "90%", marginTop: "5px"}}>
                                {user.free_images > 0 && (<span style={{color: "#a1a1a1"}}>You have <b>{user.free_images}</b> free image{user.free_images == 1?"":"s"} remaining!</span>)}
                            </div>
                        </div>
                        
                    </div>
                </div>
                {(orders != null && orders.length > 0) && (
                    <div className={styles.rounded_box} ref={order_wait}>
                        {orders[orders.length - 1].images.length > 0 && (<span>Your Images:</span>)}
                        <OrderResult order={orders[orders.length - 1]} past_order={false} size={image_size}></OrderResult>
                    </div>
                )}
                {(orders != undefined && orders.length > 1) && (
                    <div className={styles.rounded_box}>
                        <span>Past Orders:</span>
                        {orders.reverse().map((order, i) => {
                            if (i == 0) return (<></>);
                            else return (
                                <OrderResult key={"past-order-" + i} order={order} past_order={true} size={image_size}></OrderResult>
                            )
                        })}
                    </div>
                )}
                <div className={styles.rounded_box}>
                    <span>Related Themes</span>
                    {related_themes != undefined ? (
                    <div className={styles.flexbox + " " + styles.centered}>
                        <>
                        {related_themes.map((rth, i) => (
                            <ThemeIcon key={"related-theme-" + i} theme={rth} style={i > 4 ? styles.hide_on_mobile : ""}></ThemeIcon>
                        ))}
                        </>
                    </div>
                    ) : (<></>)}
                </div>
            </center>
        </PageLayout>
    )
}