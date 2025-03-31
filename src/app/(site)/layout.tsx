import theme from "@/config/theme";
import Footer from "@/partials/Footer";
import Header from "@/partials/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* <SearchModal /> */}
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
