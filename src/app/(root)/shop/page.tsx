// app/(root)/shop/page.tsx
import ImageBackGround from "@/components/componentsRoot/componentShop/background";
import BodyShop from "@/components/componentsRoot/componentShop/bodyShop";

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // 1. Cấu hình URL cơ sở (Dùng 127.0.0.1 để tránh lỗi phân giải DNS của Node.js)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8386";
    const resolvedParams = await searchParams;

    // 2. Lấy params từ URL
    const page = resolvedParams.page || '1';
    const sortBy = resolvedParams.sortBy || 'createdAt';
    const category = resolvedParams.category || '';

    let orderBy = 'createdAt';
    let sortDir = 'desc';

    if (sortBy === '-createdAt') { sortDir = 'desc'; }
    else if (sortBy === 'createdAt') { sortDir = 'asc'; }
    else if (sortBy === 'priceLow') { orderBy = 'price'; sortDir = 'asc'; }
    else if (sortBy === 'priceHigh') { orderBy = 'price'; sortDir = 'desc'; }

    const query = new URLSearchParams({
        page: page.toString(),
        items_per_page: '9',
        orderBy: orderBy,
        sort: sortDir,
        isActive: 'true'
    });

    if (category) query.append('productCategoryId', category.toString());

    // 3. TỐI ƯU HÓA: Gọi API song song (Parallel Fetching)
    // Tự động bắt lỗi riêng lẻ, API nào chết thì trả về mảng rỗng, không làm sập toàn bộ trang
    
    const fetchProducts = fetch(`${apiUrl}/products?${query.toString()}`, { cache: 'no-store' })
        .then(res => res.ok ? res.json() : { data: [], meta: null })
        .catch(err => {
            console.error("❌ Lỗi API Products:", err.message);
            return { data: [], meta: null };
        });

    // 👇 ĐÃ SỬA: Dùng /product-category (không có chữ 's' ở cuối) chuẩn xác theo Backend
    const fetchCategories = fetch(`${apiUrl}/product-category`, { cache: 'no-store' })
        .then(res => res.ok ? res.json() : [])
        .catch(err => {
            console.error("❌ Lỗi API Categories:", err.message);
            return [];
        });

    // Chờ cả 2 API hoàn thành cùng một lúc
    const [productsData, categoriesData] = await Promise.all([fetchProducts, fetchCategories]);

    // 4. Bóc tách dữ liệu chuẩn bị truyền xuống component con
    const finalProducts = productsData?.data || [];
    const finalMeta = productsData?.meta || null;
    
    // Đảm bảo categories luôn là mảng (Array) để tránh lỗi .map()
    const finalCategories = Array.isArray(categoriesData) 
        ? categoriesData 
        : (categoriesData?.data || []);

    return (
        <>
            <ImageBackGround />
            <BodyShop
                initialProducts={finalProducts}
                categories={finalCategories}
                meta={finalMeta}
            />
        </>
    );
}