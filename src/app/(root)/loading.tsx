'use client'

import Lottie from "lottie-react";

// Dùng ../../../ để đi từ thư mục src/app/(root)/ ra ngoài thư mục gốc, sau đó vào public/images/
import coffeeAnimation from "../../../public/images/Coffee love.json";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#FCF8F4] flex flex-col items-center justify-center">
            <div className="w-40 h-40 sm:w-56 sm:h-56 drop-shadow-sm">
                <Lottie 
                    animationData={coffeeAnimation} 
                    loop={true} 
                    autoplay={true}
                />
            </div>
        </div>
    );
}