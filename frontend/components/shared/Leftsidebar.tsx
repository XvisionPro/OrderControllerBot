"use client"

import {sidebarLinks} from "@/constants/index";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

function Leftsidebar() {
    const router = useRouter();
    const pathname = usePathname();

    return(
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full px-5 gap-6">
                <Image
                    src='/'
                    alt=""
                    width={48}
                    height={48}
                />
            </div>
            <div className="flex w-full  flex-col gap-6 px-5">
                {sidebarLinks.map((link)=> {
                    const isAsctive = (pathname.includes
                        (link.route) && link.route.length > 1
                        ) || pathname === link.route;

                    return(
                        <div className="">
                                <Link 
                                    href={link.route}
                                    key={link.label}
                                    className={`leftsidebar_link ${isAsctive && 'bg-blue-500'}`}
                                >
                                    <Image
                                        src={link.imgURL}
                                        alt={link.label}
                                        width={24}
                                        height={24}
                                    />
                                    <p className="text-light-1 max-lg:hidden">
                                        {link.label}
                                    </p>
                                </Link>
                        </div> 
                    )}
                    )}
            </div>
        </section>
    )
}

export default Leftsidebar;