import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer";

function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="grow">
            <Header />
            <div className="md:h-24 h-40"></div> {/* space on top of elements to render them below header */}
            <Outlet />        {/* this is where child route components would be rendered */}
            </div>
            <Footer />
        </div>
    );
}

export default Layout;