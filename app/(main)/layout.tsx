import Footer from "./components/Footer";
import Header from "./components/Header";
import Navbar from "./components/navbar/navbar";
import PayBillButton from "./components/PayBillButton";
import ScrollToTop from "./components/ScrollToTop";


export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="min-h-screen flex flex-col">
                <Header />
                <Navbar />
                {children}
                <PayBillButton/>
                <ScrollToTop />
                <Footer />

            </main>
        </>
    );
}