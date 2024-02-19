"use client"

import { SITE_NAME } from "@/constants/seo.constants";

function Leftcontentbar() {
    return (
        <div className="maincontainer">
            <section className="leftcontentbar">
                <div className="contenttitle">
                    <div className="mainwrapper">
                        {SITE_NAME}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Leftcontentbar;