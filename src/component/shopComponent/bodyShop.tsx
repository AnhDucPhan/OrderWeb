'use client'

import { useState } from "react";


const BodyShop = () => {
    const [value, setValue] = useState<number>(50);
    return (
        <div className="flex w-full px-[120px] py-[120]">
            <div className="basis-[30%] bg-red-200">
                <div>
                    <h3>Filter by price</h3>
                    <div>
                        <div className="w-1/2 mx-auto text-center mt-10">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                className="w-full accent-[#C19D56]"
                            />
                            <p className="mt-2 text-lg font-semibold text-[#C19D56]">
                                Giá trị: {value}
                            </p>
                        </div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <div>Product Categories</div>
                <div>Product Tag</div>
                <div>Products</div>
            </div>
            <div className="basis-[70%] bg-blue-200">shop product</div>
        </div>

    )
}

export default BodyShop