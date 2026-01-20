import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Sidebar from "./Sidebar";

const LIST_SIDEBAR = [
    {
        title: "Dashboard",
        link: "/dashboard",
        permission: ["admin", "gro"],
    },
    {
        title: "Compiler",
        link: "/dashboard/compiler",
        permission: ["admin"],
    },
    {
        title: "Artwork",
        link: "/dashboard/artwork",
        permission: ["admin"],
    },
    {
        title: "Quiz",
        link: "/dashboard/quiz",
        permission: ["admin"],
    },
    {
        title: "Guide",
        link: "/dashboard/guide",
        permission: ["admin"],
    },
    {
        title: "Content",
        link: "/dashboard/content",
        permission: ["admin"],
    },
    {
        title: "Users",
        link: "/dashboard/users",
        permission: ["admin"],
    },
    {
        title: "Redeem",
        link: "/dashboard/redeem",
        permission: ["admin", "gro"],
    },
    {
        title: "Merchandise",
        link: "/dashboard/merchandise",
        permission: ["admin"],
    },
    {
        title: "Report",
        link: "/dashboard/report",
        permission: ["admin"],
    },
];

const DashboardLayout = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logoutUser, isReady } = useAuth();

    const normalizedPath = useMemo(() => {
        if (!pathname) return "";
        return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    }, [pathname]);

    const isAllowed = useMemo(() => {
        if (!user?.Role) return false;
        return LIST_SIDEBAR.some((item) => normalizedPath.includes(item.link) && item.permission.includes(user.Role));
    }, [normalizedPath, user?.Role]);

    useEffect(() => {
        if (!isReady) return;
        if (!user) {
            router.replace("/sign-in");
            return;
        }
        if (!isAllowed) {
            router.replace("/");
        }
    }, [isReady, user, isAllowed, router]);

    if (!isReady || !user || !isAllowed) return null;

    return (
        <div className="min-h-screen w-full bg-slate-100 text-slate-900 overflow-x-hidden" data-theme="light">
            <div className="navbar sticky top-0 z-40 bg-slate-900 text-white px-2 lg:px-10 shadow-sm">
                <div className="navbar-start">
                    <label htmlFor="my-drawer" className="drawer-button btn btn-ghost btn-circle xl:hidden text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </label>
                    <Link href="/">
                        <img src="/images/logo-galeri-indonesia-kaya.png" alt="Logo" className="w-24" />
                    </Link>
                </div>
                <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar text-white">
                            <div className="w-10 rounded-full">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-slate-900 rounded-box z-[1] w-52 p-2 shadow">
                            <li>
                                <Link href="/admin" className="text-white hover:bg-slate-800 w-full text-left px-2 py-1 rounded">
                                    Admin Token
                                </Link>
                            </li>
                            <li>
                                <button onClick={() => logoutUser()} className="text-white hover:bg-slate-800 w-full text-left px-2 py-1 rounded">Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Sidebar userRole={user.Role} listMenu={LIST_SIDEBAR}>
                {children}
            </Sidebar>
        </div>
    );
};

export default DashboardLayout;
