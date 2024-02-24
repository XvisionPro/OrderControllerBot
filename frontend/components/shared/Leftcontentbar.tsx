"use client"

import { sidebarContent } from "@/constants";
import { SITE_NAME } from "@/constants/seo.constants";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

function Leftcontentbar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="maincontainer">
            <section className="leftcontentbar">
                <div className="contenttitle">
                    <h1 className="mainwrapper">
                        {SITE_NAME}
                    </h1>
                </div>
                <nav className="contentnav mainwrapper">
                    <ul className="contentnav__list">
                        {sidebarContent.map((link)=> {
                            const isAsctive = (pathname.includes
                                (link.route) && link.route.length > 1
                                ) || pathname === link.route;
        
                            return(
                                <li className="contentnav__list-item">
                                    <Link
                                        href={link.route}
                                        className={`contentnav__list-link ${isAsctive && 'contentnav__list-link-active'}`}
                                    >
                                        <span className="material-icons leftsideicon">{link.icon}</span>
                                        <p className="contentnav__title">{link.label}</p>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </section>
        </div>
    )
}

export default Leftcontentbar;