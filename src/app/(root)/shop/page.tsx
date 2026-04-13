import ImageBackGround from "@/components/componentsRoot/componentShop/background";
import BodyShop from "@/components/componentsRoot/componentShop/bodyShop";

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8386";
    const resolvedParams = await searchParams;

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

    // 1. API Sản phẩm
    const fetchProducts = fetch(`${apiUrl}/products?${query.toString()}`, { cache: 'no-store' })
        .then(res => res.ok ? res.json() : { data: [], meta: null })
        .catch(err => {
            console.error("❌ Lỗi API Products:", err.message);
            return { data: [], meta: null };
        });

    // 2. API Danh mục
    const fetchCategories = fetch(`${apiUrl}/product-category`, { cache: 'no-store' })
        .then(res => res.ok ? res.json() : [])
        .catch(err => {
            console.error("❌ Lỗi API Categories:", err.message);
            return [];
        });

    // 👇 3. THÊM MỚI: API Best Sellers (Lấy top 5)
    // Dùng cache: 'no-store' để luôn lấy số liệu real-time, hoặc có thể đổi thành { next: { revalidate: 60 } } để cache 60s
    // THAY ĐOẠN NÀY ĐỂ XEM CHÍNH XÁC THẰNG NESTJS TRẢ VỀ CÁI GÌ
    const fetchBestSellers = fetch(`${apiUrl}/products/top/best-sellers`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
    })
        .then(async (res) => {
            const json = await res.json();
            console.log(`🕵️ [TRINH SÁT] Trạng thái API: ${res.status}`);
            console.log(`🕵️ [TRINH SÁT] NestJS trả về cho Next.js:`, json);
            return json;
        })
        .catch(err => {
            console.error("❌ NEXT.JS LỖI NẶNG:", err.message);
            return { data: [] };
        });
    const [productsData, categoriesData, bestSellersData] = await Promise.all([
        fetchProducts,
        fetchCategories,
        fetchBestSellers
    ]);

    const finalProducts = productsData?.data || [];
    const finalMeta = productsData?.meta || null;
    const finalCategories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || []);
    const finalBestSellers = bestSellersData?.data || [];

    // 👇 2. ĐẶT MÁY QUÉT Ở ĐÂY (TRƯỚC KHI RETURN)
    console.log("👉 [DEBUG NEXTJS] Dữ liệu Best Sellers chuẩn bị đẩy xuống giao diện:", finalBestSellers);

    return (
        <>
            <ImageBackGround />
            <BodyShop
                initialProducts={finalProducts}
                categories={finalCategories}
                meta={finalMeta}
                bestSellers={finalBestSellers} // 👇 TRUYỀN PROPS XUỐNG ĐÂY
            />
        </>
    );
}