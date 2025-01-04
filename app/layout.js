import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"

const host_Grotesk = Host_Grotesk({
  subsets: ['latin']
})

export const metadata = {
  title: "LogoBuddy",
  description: "Create stunning logos in minutes with LogoBuddy – your friendly logo maker tool.",
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={host_Grotesk.className}
        >
          <Provider>
            {children}
          </Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
