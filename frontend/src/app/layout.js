import { Web3Provider } from "@/context/Web3Context";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata = {
  title: "TODO 3.0 - Blockchain Task Manager",
  description: "Decentralized TODO app built with Next.js, MERN & Ethereum",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <Navigation />
          <main className="main_content">{children}</main>
        </Web3Provider>
      </body>
    </html>
  );
}
