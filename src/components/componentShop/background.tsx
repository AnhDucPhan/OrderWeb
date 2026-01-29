'use client'

import Image from "next/image"

const ImageBackGround = () => {
    return (
        <div>
            <div className="relative w-full h-[75vh] flex">
                <Image
                    src="/images/Cool-Summer-Iced-Coffees.webp"
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
                    fill
                />
                <div className="absolute inset-0 bg-[#100A08C9]" />
            </div>

        </div>
    )
}

export default ImageBackGround;