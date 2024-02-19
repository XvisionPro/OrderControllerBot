"use client"

import {sidebarLinks} from "@/constants/index";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Icons
import DisplaySettingsOutlinedIcon from '@mui/icons-material/DisplaySettingsOutlined';

function Leftsidebar() {
    const router = useRouter();
    const pathname = usePathname();

    return(
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full justify-center">
                <Link
                    href='/'
                >
                    <DisplaySettingsOutlinedIcon className="icon"/>
                </Link>
            </div>
            <div className="flex  flex-col gap-5 px-3 justify-center">
                {sidebarLinks.map((link)=> {
                    const isAsctive = (pathname.includes
                        (link.route) && link.route.length > 1
                        ) || pathname === link.route;

                    return(
                        <div className="">
                                <Link 
                                    href={link.route}
                                    key={link.label}
                                    className={`leftsidebar__link ${isAsctive && 'leftsidebar__link-active'}`}
                                >
                                    <span className="material-icons leftsideicon">{link.icon}</span>
                                    {/* <p className="text-light-1 max-lg:hidden">
                                        {link.label}
                                    </p> */}
                                </Link>
                        </div> 
                    )}
                    )}
            </div>
        </section>
    )
}

export default Leftsidebar;