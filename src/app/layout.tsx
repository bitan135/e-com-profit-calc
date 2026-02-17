import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Amazon, Flipkart & Meesho Seller Profit Calculator India | Free Tool",
    description: "Calculate your exact Net Profit, ROI, and Margin for Amazon, Flipkart, and Meesho. Accounts for referral fees, closing fees, GST, advertising spend, and shipping losses.",
    keywords: [
        "Amazon seller profit calculator India",
        "Flipkart seller profit calculator",
        "Meesho seller profit calculator",
        "Amazon fees calculation India",
        "E-commerce profit calculator India",
        "Amazon seller margin calculator",
        "Net profit calculator for sellers",
        "GST calculator for Amazon sellers"
    ],
    openGraph: {
        title: "Amazon, Flipkart & Meesho Seller Profit Calculator India",
        description: "Stop guessing. Calculate your exact profit margin per order with GST, Ads, and Returns included.",
        type: "website",
        locale: "en_IN",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
