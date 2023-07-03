
import { mysqlQuery } from "./utils";

/*export interface Theme{
    category: number,
    name: string,
    similar_themes: string[]
}*/

export async function getTheme(con, slug){
    if (con == null) return {error404: false, error_msg: "Could not connect to the server!"};

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
    }
}

export async function relatedThemes(con, theme){
    const void_ids = [15, theme.id];
    const related_themes = [];
    for (let i = 0; i < theme.related_themes.length; i++){
        const other_theme = await getTheme(con, parseInt(theme.related_themes[i]));
        if (other_theme.error_msg == undefined) {
            related_themes.push(other_theme);
            void_ids.push(other_theme.id);
        }
        else {
            console.log("Related Theme error 1:");
            console.log(other_theme);
        }
    }
    
    const fillcount = 8 - related_themes.length;
    for (let i = 0; i < fillcount; i++){
        const other_theme = await randomTheme(con, void_ids, process.env.THEME_MAX_ID);
        if (other_theme.error_msg == undefined) related_themes.push(other_theme);
        else console.log("Related theme error 2");
    }

    return related_themes;
}

export async function randomTheme(con, void_ids, max_id) {
    const id = Math.floor(Math.random() * max_id) + 1;
    if (void_ids.includes(id)) return randomTheme(con, void_ids, max_id);
    const theme = await getTheme(con, id);
    if (theme.discontinued == true) {
        void_ids.push(id);
        return randomTheme(con, void_ids, max_id);
    }
    void_ids.push(id);
    return theme;
}