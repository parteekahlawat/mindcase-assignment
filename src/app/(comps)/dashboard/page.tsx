"use client";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import { useTheme } from "next-themes"
const supabase = createClient(
  "https://aqbjpffvdeazeyfgcame.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYmpwZmZ2ZGVhemV5ZmdjYW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NTQxODQsImV4cCI6MjAyOTEzMDE4NH0.0Rg35j8XoXQuKdyyWnA4zS1UbYutfiI8q6QMWKp-pSA"
);

const genAI = new GoogleGenerativeAI("AIzaSyBKVeYliISouYFYbSnicXbIBrzLfw1xAvw");
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

export default function Dashboard() {
  const [username, setUsername] = useState("Stranger");
  const [message, setMessage] = useState("");
  const [apiresponse, setApiresponse] = useState("");
  const [placeholderText, setPlace]  =useState("Response will be here")
  const router = useRouter();
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    async function getUserData() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          throw error;
        }
        if (data?.user?.email !== undefined) {
          setUsername(data.user.email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    getUserData();
    // setTheme("dark")
  }, []);

  async function apiresp(msg:any) {
    const prompt = msg;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    animateApiResponse(response.text());
  }

  async function animateApiResponse(response:any) {
    let tempApiResponse = "";
    for (let i = 0; i < response.length; i++) {
      setTimeout(() => {
        tempApiResponse += response[i];
        setApiresponse(tempApiResponse);
      }, 50 * i);
    }
    setPlace("Response will be here")
  }

  async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    console.log(error);
    router.push("/");
  }

  const handleMessageChange = (event:any) => {
    setMessage(event.target.value);
  };

  const handleClick = () => {
    apiresp(message);
    setPlace("Generating...")
    setMessage("");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center">
        <Button onClick={() => setTheme("dark")} className="m-4">
          Dark
        </Button>
        <Button onClick={() => setTheme("light")}>
          Light
        </Button>
      </div>
      
      <h1 className={`text-3xl mb-4 text-black`}>
        Hey {username}
      </h1>

      <div className="grid grid-cols-1 gap-4 w-full px-8">
        <Textarea
          className="border rounded-md p-2 placeholder-gray-400 text-gray-800 w-full h-64 resize-none"
          placeholder={placeholderText}
          value={apiresponse}
          readOnly={true}
        />
        <Input
          className="border rounded-md p-2 placeholder-gray-400 text-gray-800 w-full"
          type="text"
          placeholder="Type your text"
          onChange={handleMessageChange}
          value={message}
        />
        <Button
          className={`hover:bg-blue-600 ${theme === 'light' ? 'text-light' : 'text-black'} font-semibold py-2 px-4 rounded-md`}
          onClick={handleClick}
        >
          Send message
        </Button>
      </div>

      <button
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out"
        onClick={signOutUser}
      >
        Log Out
      </button>
    </div>
  );
}
