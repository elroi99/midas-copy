import Image from "next/image";
import HomePage from "@/src/Screens/homepage";

export default function Home() {
  console.log("hello fake")
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <HomePage/>
        </div>
  );
}
