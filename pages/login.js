import { signIn, signOut } from "next-auth/react";

export default function Login(){
    return (
        <>
            <button onClick={() => signIn()}>Log in</button>
            <button variant="primary" onClick={() => signOut()}>Log out</button>
        </>
    )
}