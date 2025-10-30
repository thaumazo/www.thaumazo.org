import "./globals.css";

import Providers from "@/context/Providers";

export const metadata = {
  title: "Thaumazo",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className={`light ${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`light antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
