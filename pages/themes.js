import PageLayout from "comps/PageLayout.js"
import styles from "styles/Main.module.css";
import {shuffleArray, getConnection } from "lib/utils.ts";
import { searchThemes } from "lib/theme_utils";
import { useState, useEffect } from "react";
import { getServerSession } from "next-auth";
import { getEmailUser } from "lib/auth_utils";
import { useRouter } from "next/router";
import { authOptions } from "pages/api/auth/[...nextauth].js";
import { theme_data, category_title } from "../lib/themes";
import ThemeScroll from "comps/ThemeScroll.js";
import ThemeIcon from "comps/ThemeIcon";

export async function getServerSideProps(context){

    const categories = []

    for (const [theme_id, theme] of Object.entries(theme_data)){
        if (!theme.hidden){
            const ctitle = category_title[theme.category];
            if (ctitle == undefined) console.warn("Undefined category " + theme.id + ": " + JSON.stringify(theme));
            
            if (categories.length < theme.category + 1){
                for (let i = 0; i < theme.category + 1 - categories.length; i++){
                    categories.push({name: "<Empty Category>", themes: []});
                }
            }

            categories[theme.category].name = ctitle;
            categories[theme.category].themes.push(theme);
        }
    }

    const session = await getServerSession(context.req, context.res, authOptions);

    const con = await getConnection();
    //if (con == null) return {props: {context: {error404: false, error_msg: "Could not connect to the server!"}}}
    
    var user = null;
    if (con != null) {
        user = await getEmailUser(session, con);
        if (user != null && user.banned){
            return {props: {context: {error404: false, error_msg: "You are banned!"}}}
        }
        con.end();
    }

    return {props: {categories, user}}

}

export default function ThemesPage({categories, user}){

    const [searchResults, setSearchResults] = useState(null);
    const [page_setup, setPageSetup] = useState(false);

    const router = useRouter();
	const { search } = router.query;

    useEffect(() => {
        if (categories != undefined && !page_setup){
            setPageSetup(true);
            const searchinput = document.getElementById("search-text");
            searchinput.addEventListener("input", () => {
                if (searchinput.value.length > 2) {
                    setSearchResults(searchThemes(searchinput.value));
                }
                else setSearchResults(null);
            });
            if (search != undefined && search.length > 0) {
                searchinput.value = search;
                setSearchResults(searchThemes(search));
            }
        }
    });

    if (categories == undefined){
        return (<></>);
    }
    return (
        <PageLayout title={"Explore QR Code Themes | Generate Beautiful AI QR Code Art | QR Theme"} user={user}>
            <div style={{width: "100%", alignItems: "right", justifyContent: "right", textAlign: "right"}}>
                <input maxLength="60" id="search-text" className={styles.input} style={{width: "250px", marginRight: "10px"}} placeholder="Search Themes..."></input>
            </div>

            {searchResults == null ? 
            (<>{categories.map((category, i) => (
                <ThemeScroll key={"category-" + i} category={category}></ThemeScroll>
            ))}</>) 
            : (
                <div className={styles.rounded_box}>
                    {searchResults.length > 0 ? (<><div style={{textAlign: "left", fontSize: "20pt"}}>Search Results</div>
                    <div className={styles.flexbox}>
                        {searchResults.map(theme => (
                            <ThemeIcon key={"theme-" + theme.slug + Math.random()} theme={theme}></ThemeIcon>
                        ))}
                    </div></>) : (<div>Could not find any results for this search.</div>)}
                </div>
            )}
            
        </PageLayout>
    )

}