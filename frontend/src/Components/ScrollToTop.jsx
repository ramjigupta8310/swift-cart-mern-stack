import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    // Set Scroll Restorition To Manual When The App Starts
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []); // 

    // Go To Top When The Page Changes
    useEffect(() => {
        window.scrollTo(0, 0); // Without Smooth Scroll
    }, [pathname]);

    // Same page link click pe top pe jao
    useEffect(() => {
        const handleClick = (event) => {
            const target = event.target.closest("a");
            if (target && target.pathname === window.location.pathname) {
                window.scrollTo(0, 0); // Without Smooth Scroll
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return null;
};

export default ScrollToTop;