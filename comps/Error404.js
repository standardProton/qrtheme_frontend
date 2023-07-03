import PageLayout from "comps/PageLayout.js";
import styles from "styles/Main.module.css";
import Image from "next/image";

export default function Error404(){
    return (
        <PageLayout title={"Error 404"}>
            <div>
                <div className={styles.rounded_box} style={{marginTop: "75px", marginBottom: "240px"}}>
                    <div style={{marginTop: "15px", marginBottom: "30px"}}>
                        <Image src="/icons/x_white.png" height={75} width={75} alt="X"></Image>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        {"We're sorry, we couldn't find what you're looking for"}
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}