import Header from "./repeats/Header";
import Footer from "./repeats/Footer";
import { CheckoutProvider } from "./checkout/store/CheckoutProvider";

export default function Layout({ children }) {
  return (
    <CheckoutProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </CheckoutProvider>
  );
}
