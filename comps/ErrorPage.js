import PageLayout from "comps/PageLayout.js";
import styles from "styles/Main.module.css";
import Image from "next/image";

export default function ErrorPage({msg}){
    return (
        <PageLayout title={"There was an Error"}>
            <div>
                <div className={styles.rounded_box} style={{marginTop: "75px", marginBottom: "240px"}}>
                    <div style={{marginTop: "15px", marginBottom: "30px"}}>
                        <Image src="/icons/x_white.png" height={75} width={75} alt="X"></Image>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        {false && (<div>There was an error.</div>)}
                        <div>{msg}</div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}