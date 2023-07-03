import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async signIn({account, profile}) {
            console.log("signin, account.provider = " + account.provider);
            if (account.provider == "google") return profile.email_verified;
            return true;
        }
    }
    /*callbacks:{
        /*async signIn({user, account, profile, email, credentials}){
            return "/500?msg=You are banned!"
        }
        /*async session({session, token}){
            console.log("------------------");
            console.log("session:");
            console.log(session);
            console.log("token:");
            console.log(token);
            return session;
        }
    }//*/
}

export default NextAuth(authOptions);