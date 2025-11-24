import "./globals.css";
import Header from "@components/repeats/Header";
import Footer from "@components/repeats/Footer";
import { CheckoutProvider } from "@components/checkout/store/CheckoutProvider";

export const metadata = {
  title: "Leonardo Doors",
  description: "Premium door solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CheckoutProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CheckoutProvider>
      </body>
    </html>
  );
}

