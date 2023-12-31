
import { mysqlQuery, getId } from "./utils";
import { theme_data, slug_map } from "./themes.js";

/*export interface Theme{
    category: number,
    name: string,
    similar_themes: string[]
}*/

export function getThemeSlug(slug){
    const e404 = {error404: true, error_msg: "Could not find this theme!"};
    if (typeof slug == "string") {
        const theme_id = slug_map["" + slug];
        if (theme_id == undefined) return e404;
        return getTheme(theme_id);
    }
    return e404;
}

export function getTheme(id){
    /*if (con == null) return {error404: false, error_msg: "Could not connect to the server!"};

    var queryparams = ["id", slug];
    if (typeof slug == "string") queryparams = ["slug", slug.toLowerCase()];

    const res1 = await mysqlQuery(con, "SELECT id, category, name, slug, similar_themes, hidden FROM themes WHERE " + queryparams[0] + "=?", [queryparams[1]]);
    if (res1.error_msg != null) return {error404: false, error_msg: res1.error_msg};
    else if (res1.results.length == 0) return {error404: true, error_msg: "Could not find this theme!"};

    const res = res1.results[0];

    if (res.hidden == '1') return {error404: true, error_msg: "This theme has been discontinued!", discontinued: true};

    return {
        id: res.id,
        category: res.category == null ? 3 : res.category,
        name: res.name,
        slug: res.slug,
        related_themes: res.similar_themes == null ? [] : res.similar_themes.split(" "),
    }*/

    const e404 = {error404: true, error_msg: "Could not find this theme!"};

    let theme = theme_data[id];

    if (theme == undefined) return e404;
    if (theme.hidden) return {error404: true, error_msg: "This theme has been discontinued!", discontinued: true}

    return theme == undefined ? e404 : theme;
}

export async function createThemesList(con){ //dev use only
    const res = await mysqlQuery(con, "SELECT * FROM themes WHERE 1", []);
    const f = {}
    const slug_map = {}
    for (let i = 0; i < res.results.length; i++){
        const theme = res.results[i];

        console.log(theme);

        const related_themes = theme.similar_themes == null ? [] : theme.similar_themes.split(" ");
        for (let i = 0; i < related_themes.length; i++){
            related_themes[i] = parseInt(related_themes[i]);
        }

        f["" + theme.id] = {
            id: theme.id,
            name: theme.name,
            slug: theme.slug,
            related_themes,
            hidden: theme.hidden != null,
            price_ids: ["", "", ""]
        }
        slug_map[theme.slug] = theme.id;
    }
    console.log(slug_map);
    console.log(f);
    return f;
}

export function relatedThemes(theme){
    const void_ids = [15, theme.id, 20];
    const related_themes = [];
    for (let i = 0; i < theme.related_themes.length; i++){
        const other_theme = getTheme(theme.related_themes[i]);
        if (other_theme.error_msg == undefined) {
            related_themes.push(other_theme);
            void_ids.push(other_theme.id);
        } //else console.log("te1: " + JSON.stringify(other_theme));
    }
    
    const fillcount = 8 - related_themes.length;
    for (let i = 0; i < fillcount; i++){
        const other_theme = randomTheme(void_ids, process.env.THEME_MAX_ID);
        if (other_theme.error_msg == undefined) related_themes.push(other_theme);
        //else console.log("te2: " + JSON.stringify(other_theme));
    }

    return related_themes;
}

export function randomTheme(void_ids, max_id) {
    const id = Math.floor(Math.random() * max_id) + 1;
    if (void_ids.includes(id)) return randomTheme(void_ids, max_id);
    const theme = getTheme(id);
    void_ids.push(id);
    if (theme.discontinued == true) return randomTheme(void_ids, max_id);
    else if (theme.error_msg != null && theme.error_msg == "Could not find this theme!") return randomTheme(void_ids, max_id);
    return theme;
}

export function searchThemes(search){
    const found = [];
    const added_ids = [];
    const text_split = search.toLowerCase().replaceAll(",", "").replaceAll(".", "").split(" ");

    for (let i = 0; i < text_split.length; i++){
        const text = text_split[i];
        if (text.length > 2){
            for (const [theme_id, theme] of Object.entries(theme_data)){
                if (!theme.hidden && !added_ids.includes(theme.id)){
                    if (theme.name.toLowerCase().includes(text) || 
                        text.includes(theme.slug.toLowerCase()) ||
                        theme.description.toLowerCase().includes(text) ||
                        (theme.additional_keywords != undefined && theme.additional_keywords.includes(text))) {
                            found.push(theme);
                            added_ids.push(theme.id);
                        }
                }
            }
        }
    }
    return found;
}

export async function getOrders(con, user_id, theme_id){
    let orders = [];
    const order_res = await mysqlQuery(con, "SELECT id, output, theme_id, qr_url, order_timestamp FROM orders WHERE owner = ? AND theme_id = ? AND (order_status > 1 OR order_status IS null)", [user_id, theme_id]);
    if (order_res != null && order_res.error_msg == null){
        const images = order_res.results;
        for (let i = 0; i < images.length; i++){
            orders.push({order_id: images[i].id, timestamp: images[i].order_timestamp, theme_id: images[i].theme_id, qr_url: images[i].qr_url, images: images[i].output.split(" ").filter(name => name.length > 0)});
        }
    }
    orders = orders.sort((a, b) => b.timestamp - a.timestamp);
    return orders;
}

export async function getOrder(con, pid){
    if (typeof pid != "string"){
        console.error("Invalid type for pid while getting order");
        return null;
    }
    const id = getId(pid);
    const order_res = await mysqlQuery(con, "SELECT id, pid, output, theme_id, qr_url, order_timestamp FROM orders WHERE id = ? AND (order_status > 1 OR order_status IS null)", [id]);
    if (order_res != null && order_res.error_msg == null && order_res.results.length > 0){
        const image = order_res.results[0]
       return {order_id: image.id, order_pid: image.pid, timestamp: image.order_timestamp, theme_id: image.theme_id, qr_url: image.qr_url, images: image.output.split(" ").filter(name => name.length > 0)};
    }
    return null;
}