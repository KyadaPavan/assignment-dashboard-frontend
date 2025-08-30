import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: "Portfolio Dashboard | Dynamic Stock Tracking",
  description: "A professional portfolio dashboard for real-time stock tracking with comprehensive analytics and responsive design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b158a" />
      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
