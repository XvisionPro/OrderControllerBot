"use client"

import { SITE_NAME } from "@/constants/seo.constants";

function Leftcontentbar() {
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
                        <li className="contentnav__list-item">Item1</li>
                        <li className="contentnav__list-item">Item2</li>
                        <li className="contentnav__list-item">Item3</li>
                    </ul>
                </nav>
            </section>
        </div>
    )
}

export default Leftcontentbar;