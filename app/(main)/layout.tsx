import Footer from "./components/Footer";
import Navbar from "./components/navbar/navbar";
import ScrollToTop from "./components/ScrollToTop";


export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="min-h-screen flex flex-col">
                <Navbar />
                {children}
                <ScrollToTop />
                <Footer />

            </main>
        </>
    );
}