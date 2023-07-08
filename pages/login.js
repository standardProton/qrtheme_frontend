import { signIn, signOut } from "next-auth/react";
import Image from "next/image.js";

export default function Login(){
    return (
        <>
            <button onClick={() => signIn()}>Log in</button>
            <button variant="primary" onClick={() => signOut()}>Log out</button>
            <Image src="https://qr-theme-image.s3.us-east-2.amazonaws.com/testing/b80e366a1f84f11d3da4a2bcd9b98bd10bfde1b5a22a7a5eae7208ccf7888434.jpg" height="200" width="200" alt="Test Image"></Image>
        </>
    )
}