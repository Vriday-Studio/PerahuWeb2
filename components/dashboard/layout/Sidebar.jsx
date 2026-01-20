import { useRef } from "react";
import Link from "next/link";

export default function Sidebar({ userRole, listMenu, children }) {
    const drawerRef = useRef(null);

    const handleLinkClick = () => {
        if (drawerRef.current.checked) {
            drawerRef.current.checked = false;
        }
    };

    return (
        <div className="drawer xl:drawer-open w-full">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" ref={drawerRef} />
            <div className="drawer-content w-full overflow-x-hidden bg-slate-50 max-h-screen overflow-y-auto">
                {children}
            </div>
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-slate-900 text-white min-h-screen w-52 p-4 flex flex-col gap-y-1 sticky top-0">
                    {listMenu.map(
                        (item) =>
                            item.permission.includes(userRole) && (
                                <li key={item.title}>
                                    <Link onClick={handleLinkClick} href={item.link} className="text-white hover:text-slate-300">
                                        {item.title}
                                    </Link>
                                </li>
                            )
                    )}
                </ul>
            </div>
        </div>
    );
}
