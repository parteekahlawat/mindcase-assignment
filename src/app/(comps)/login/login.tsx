"use client"
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";

const supabase = createClient("#Link", "#ID")
export default function Login() {
    const router = useRouter();

    useEffect(()=>{
        supabase.auth.onAuthStateChange(async (event)=>{
            if(event === "SIGNED_IN"){
                console.log(event)
                router.push("/dashboard")
            }
            else if(event === "SIGNED_OUT"){
                console.log(event)
                router.push("/")
            }
        })
    })
    
    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-screen">
            <div className="w-full max-w-md p-6 rounded-lg shadow-lg dark:bg-gray-800">
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme="dark"
                    providers={["google"]}
                />
            </div>
        </section>
        </>
    );
}
