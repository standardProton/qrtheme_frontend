
import PageLayout from "comps/PageLayout.js";
import styles from "styles/Main.module.css";

export default function TermsAndPrivacy(){
    return (
        <PageLayout title={"Terms & Privacy"}>
            <div className={styles.rounded_box} style={{textAlign: "left", paddingLeft: "40px", paddingRight: "40px"}}>
            <h2>Privacy Policy</h2>
                <p>
                    QR-Theme is strongly committed towards respecting and protecting the privacy of our users. 
                    This Privacy Policy outlines how we collect, safeguard, and use the information provided by users on our platform. 
                    Please read this policy carefully to understand our practices regarding your data.
                </p>
                <h3>1. Information We Collect</h3>
                <p>By signing in or creating an account on QR Theme, you provide us with the name and email associated with your Google account.
                    By using the platform, you provide us analytical data, such as in which themes you view.
                </p>
                <h3>2. Data Use and Security</h3>
                <p>
                    QR Theme employs robust security measures to protect the information we collect. All data is stored on secure servers with restricted access to authorized personnel only.
                </p>
                <p>
                We may internally analyze certain data collected from users to improve our product, enhance user experience, or improve functionality. 
                This aggregate analysis does not involve the identification of individual users. 
                We may also use data to respond to customer service or technical support issues and requests.
                </p>
                <h3>3. Data Sharing</h3>
                <p>QR Theme does not sell, rent, trade, or otherwise disclose personal information of any account to any third party or marketing affiliate.</p>
                <hr></hr>
                <h2>Terms & Conditions</h2>
                <p>Please read these Terms and Conditions ("Agreement") carefully before accessing or 
                    using the QR-Theme platform ("Service") ("QR Theme,"" "we," "us," or "our"). 
                    This Agreement sets forth the legally binding terms and conditions for your use of the Service.</p>
                <h3>1. Acceptance of Terms</h3>
                <p>
                By accessing or using our Service, you agree to be bound by this Agreement. If you do not agree with any part of the Agreement, you may not access or use the Service.
                </p>
                <h3>2. Description of Service</h3>
                <p>
                    Our platform provides a faster way for users to utilize Image Generation Artificial Intelligence models software to create Scannable QR Code Illustrations.
                </p>
                <h3>3. Intellectual Property</h3>
                <p>
                    The Service and all associated software, settings, and AI settings (such as prompts, weights, etc.) belong to QR Theme. However, the AI-Generated Images and Artwork that you make
                    through this Service remains your own intellectual property. This means you retain the right to distribute, modify, or resell the content you generate on our Service. 
                    You are encouraged to download your AI-Generated images onto your own
                    device immediately after they are produced. QR Theme will not be held responsible for storing your Intellectual Property in perpetuity.
                </p>
                <h3>4. Use of Service</h3>
                <p>4.1 User Accounts: You may need to create a user account to access certain features of the Service.
                    You are responsible for maintaining the confidentiality of your account information and agree to be
                    responsible for all activities that occur under your account.
                </p>
                <p>4.2 Suggestions: By sending content to us (such as in suggesting a theme), you grant QR Theme a worldwide,
                    royalty-free, non-exclusive license to use, reproduce, modify, adapt, publish, translate, and distribute
                    products that are inspired directly or indirectly by the contents of your suggestion. 
                </p>
                <p>
                    4.3 Prohibited Activities: You agree not to use the Service for any unlawful or unauthorized activities. 
                    <br></br><u>You shall not:</u>
                    <br></br>
                    • Use the Service to create content that contains viruses, malware, illegal content, or other harmful components.
                    <br></br>
                    • Use the Service to create content that displays content that is defamatory, obscene, or harmful to others.
                    <br></br>
                    • Use the Service to create content that promotes illegal activities or violates the rights of others.
                </p>
                <p>4.4 Termination: We reserve the right to terminate or suspend your access to the Service at any time,
                    with or without prior notice. Upon termination, your right to use the Service will immediately cease, and any
                    remaining obligations or provisions of this Agreement shall survive. 
                </p>
                <p>By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by this Agreement.</p>
                <hr></hr>
                <center>
                <div style={{width: "75%"}}>
                    <p>
                        Please contact <b>support@qr-theme.com</b> if you have questions or concerns regarding our Privacy Policy or Terms & Conditions!
                    </p>
                </div>
                </center>

            </div>
        </PageLayout>
    )
}