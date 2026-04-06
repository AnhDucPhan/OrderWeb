'use client';

import React, { useState, useEffect } from "react";
// Nhớ import Image của Next.js để tối ưu hình ảnh
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import thêm Textarea cho mô tả món
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
// Thay đổi icon Package -> Utensils cho phù hợp Menu
import { Search, Plus, Pencil, Trash2, Utensils, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";

// =========================================================
// 👇 Giả định các API Hooks cho Menu (Product) và Nhóm món (ProductCategory)
// Bạn cần thay đổi đường dẫn import cho đúng thực tế dự án
// =========================================================


import {
  useGetProductCategoriesQuery,
  useCreateProductCategoryMutation
} from "@/services/productCategoryApi";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from "@/services/productApi";

// 👇 Định nghĩa kiểu dữ liệu Món ăn (khớp với Schema Prisma)
interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  thumbnail?: string; // URL hình ảnh
  isActive: boolean; // Thay cho isActive (còn bán hay không)
  productCategoryId: number;
  productCategory?: { id: number; name: string };
  createdAt: string;
}

// 👇 Định nghĩa kiểu dữ liệu Form
interface MenuForm {
  name: string;
  categoryName: string; // Tên danh mục để hiển thị trong Select
  price: string | number;
  description: string;
  thumbnail: string;
  isActive: boolean;
}

const PAGE_SIZE: number = 8;
// Form trống mặc định
const EMPTY_FORM: MenuForm = {
  name: "",
  categoryName: "",
  price: "",
  description: "",
  thumbnail: "",
  isActive: true
};

export default function MenuAdmin() {
  const [page, setPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("Tất cả");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // State cho Modal Món ăn
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  // State cho Modal Nhóm món mới
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // =========================================================
  1  // 👇 Gọi API lấy dữ liệu
  // =========================================================

  // 1. Lấy danh sách Nhóm món (để làm Tabs và Select)
  const { data: categoriesData = [] } = useGetProductCategoriesQuery();
  // Tạo mảng tên danh mục cho Tabs, thêm "Tất cả" đầu tiên
  const TAB_CATEGORIES: string[] = ["Tất cả", ...categoriesData.map(c => c.name)];

  // 2. Các mutations xử lý CRUD Món ăn
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // 3. Mutation thêm nhóm món mới
  const [createProductCategory, { isLoading: isCreatingCategory }] = useCreateProductCategoryMutation();

  // =========================================================
  // 👇 Logic Filter và Phân trang
  // =========================================================
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset về trang 1 khi thay đổi filter
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab, availabilityFilter]);

  // Tìm ID của danh mục đang chọn trong Tab
  const selectedTabCategoryObj = categoriesData.find(c => c.name === activeTab);
  const filterCategoryId = activeTab === "Tất cả" ? undefined : selectedTabCategoryObj?.id;

  // 4. Lấy danh sách Món ăn có filter và phân trang
  const { data: responseData, isLoading } = useGetProductsQuery({
    page,
    perPage: PAGE_SIZE,
    q: debouncedSearch,
    productCategoryId: filterCategoryId,
    // Chuyển đổi filter Availablity sang boolean hoặc undefined
    isActive: availabilityFilter === "all" ? undefined : (availabilityFilter === "available")
  });

  const menuItemsList: MenuItem[] = responseData?.data || [];
  const meta = responseData?.meta;

  // =========================================================
  // 👇 Xử lý Actions (Thêm/Sửa/Xóa)
  // =========================================================

  function openAdd(): void {
    setEditingItem(null);
    const defaultCatName = categoriesData.length > 0 ? categoriesData[0].name : "";
    setForm({ ...EMPTY_FORM, categoryName: defaultCatName });

    // Reset file và ảnh preview
    setSelectedFile(null);
    setPreviewUrl(null);
    setDialogOpen(true);
  }

  function openEdit(item: MenuItem): void {
    setEditingItem(item);
    setForm({
      name: item.name,
      categoryName: item.productCategory?.name || "",
      price: item.price,
      description: item.description || "",
      thumbnail: item.thumbnail || "",
      isActive: item.isActive
    });

    // Gán ảnh có sẵn từ DB làm ảnh preview, reset file mới
    setSelectedFile(null);
    setPreviewUrl(item.thumbnail || null);
    setDialogOpen(true);
  }

  async function handleSave() {
    // Validate cơ bản
    if (!form.name.trim() || form.price === "" || Number(form.price) < 0 || !form.categoryName) {
      toast.error("Vui lòng nhập đầy đủ Tên, Giá hợp lệ và chọn Phân loại!");
      return;
    }
    const selectedFormCatObj = categoriesData.find(c => c.name === form.categoryName);
    const currentIsActive = form.isActive;
    // 👇 1. KHỞI TẠO FORMDATA THAY VÌ OBJECT
    const formData = new FormData();
    // 👇 2. APPEND TỪNG TRƯỜNG VÀO (Lưu ý: FormData chỉ nhận chuỗi String hoặc File)
    formData.append('name', form.name.trim());
    formData.append('price', String(form.price));
    formData.append('description', form.description.trim());
    formData.append('isActive', currentIsActive ? 'true' : 'false');
    formData.append('productCategoryId', String(selectedFormCatObj?.id || 0));

    if (selectedFile) {
      formData.append('thumbnail', selectedFile);
    }

    console.log("👉 Đang gửi API với isActive:", currentIsActive);

    try {
      if (editingItem) {
        // Cập nhật: Cần truyền cả id và formData
        await updateProduct({ id: editingItem.id, data: formData as any }).unwrap();
        toast.success(`Cập nhật món thành công!`);
      } else {
        // Tạo mới: Truyền thẳng formData
        await createProduct(formData).unwrap();
        toast.success(`Thêm món mới thành công!`);
      }
      setDialogOpen(false);
      setTimeout(() => {
         setForm(EMPTY_FORM);
         setEditingItem(null);
      }, 300);
    } catch (error: any) {
      // 1. Khởi tạo câu lỗi mặc định
      let errorMessage = "Có lỗi xảy ra, vui lòng thử lại!";

      // 2. Bóc tách lỗi từ Backend NestJS một cách an toàn
      const backendMessage = error?.data?.message;

      if (backendMessage) {
        if (typeof backendMessage === 'string') {
          errorMessage = backendMessage;
        } else if (Array.isArray(backendMessage)) {
          // Trường hợp 2: NestJS trả về mảng các lỗi Validation (VD: ["Tên không được để trống", "Giá phải là số"])
          errorMessage = backendMessage[0]; // Lấy tạm lỗi đầu tiên ra hiện
        } else if (typeof backendMessage === 'object') {
          // Trường hợp 3: NestJS trả về Object (VD: { property: "..." } giống lỗi của bạn)
          // Rút trích giá trị (value) đầu tiên trong Object đó ra
          errorMessage = Object.values(backendMessage)[0] as string;
        }
      }

      // 3. Hiển thị Toast (Lúc này errorMessage chắc chắn 100% là String)
      toast.error(errorMessage);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Tạo một đường dẫn ảo (blob URL) để hiển thị ảnh vừa chọn
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Xác nhận xóa
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id).unwrap();
      toast.success(`Đã xóa món "${deleteTarget.name}" khỏi thực đơn!`);
      setDeleteTarget(null);
      // Nếu xóa phần tử cuối của trang, quay về trang trước
      if (menuItemsList.length === 1 && page > 1) setPage(page - 1);
    } catch (error) {
      toast.error("Lỗi khi xóa món ăn!");
    }
  }

  // Lưu Nhóm món (Category) mới
  async function handleSaveCategory() {
    if (!newCategoryName.trim()) return;
    try {
      await createProductCategory({ name: newCategoryName.trim() }).unwrap();
      toast.success("Thêm nhóm món mới thành công!");
      setCategoryDialogOpen(false);
      setNewCategoryName(""); // Reset form input
    } catch (error: any) {
      // Xử lý lỗi trùng tên (Backend trả về 409 chẳng hạn)
      toast.error(error?.data?.message || "Tên nhóm món này đã tồn tại!");
    }
  }

  // =========================================================
  // 👇 Giao diện (Render)
  // =========================================================
  return (
    <div className="min-h-screen bg-stone-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-5"> {/* Tăng max-width lên một chút cho thoải mái */}

        {/* 1. Header: Tiêu đề và Nút bấm */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Quản lý Thực đơn (Menu)</h1>
            <p className="text-sm text-stone-400 mt-0.5">Đang kinh doanh {meta?.total || 0} món ăn & đồ uống</p>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Nút mở Modal thêm Nhóm món */}
            <Button variant="outline" onClick={() => setCategoryDialogOpen(true)} className="gap-2 shadow-sm text-stone-700 bg-white hover:bg-stone-100 h-10">
              <Plus size={16} /> Thêm nhóm món
            </Button>
            {/* Nút mở Modal thêm Món ăn */}
            <Button onClick={openAdd} className="bg-black hover:bg-stone-800 text-white! gap-2 shadow-sm h-10 px-5">
              <Plus size={16} /> Thêm món mới
            </Button>
          </div>
        </div>

        {/* 2. Thanh Filter: Tìm kiếm và Trạng thái */}
        <div className="flex gap-2 flex-wrap mt-4 bg-white p-2 rounded-xl border border-stone-100 shadow-sm">
          <div className="relative flex-1 min-w-60">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder="Tìm tên món, mô tả..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 bg-stone-50/50 border-stone-200 text-sm h-10 focus-visible:ring-amber-500"
            />
          </div>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-44 h-10 bg-white border-stone-200 text-sm focus:ring-amber-500">
              <SelectValue placeholder="Trạng thái món" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="available">Đang kinh doanh</SelectItem>
              <SelectItem value="unavailable">Tạm ngưng bán</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3. Khu vực chính: Tabs và Bảng dữ liệu */}
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
          {/* Tabs Danh mục */}
          <div className="border-b border-stone-100 px-4 pt-1 bg-stone-50/40">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent h-auto p-0 gap-0 overflow-x-auto flex-nowrap hide-scrollbar">
                {TAB_CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat} value={cat}
                    className="rounded-none whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:text-amber-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-stone-500 text-sm px-4 py-3.5 h-auto font-medium transition-all"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Bảng Món ăn */}
          <Table>
            <TableHeader>
              <TableRow className="bg-stone-50/80 hover:bg-stone-50/80">
                <TableHead className="text-xs text-stone-500 font-semibold w-[80px] text-center px-3">Ảnh</TableHead>
                <TableHead className="text-xs text-stone-500 font-semibold w-[35%]">Tên món & Mô tả</TableHead>
                <TableHead className="text-xs text-stone-500 font-semibold w-32">Nhóm</TableHead>
                <TableHead className="text-xs text-stone-500 font-semibold w-36 text-right">Giá bán</TableHead>
                <TableHead className="text-xs text-stone-500 font-semibold w-32 text-center">Trạng thái</TableHead>
                <TableHead className="text-xs text-stone-500 font-semibold w-28 text-right px-4">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-16"><Loader2 className="animate-spin mx-auto mb-3 text-amber-600" size={24} />Đang tải thực đơn...</TableCell></TableRow>
              ) : menuItemsList.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-16 text-stone-400"><Utensils size={32} className="mx-auto mb-3 opacity-50" />Thực đơn trống hoặc không tìm thấy món phù hợp.</TableCell></TableRow>
              ) : (
                menuItemsList.map((item) => (
                  <TableRow key={item.id} className="hover:bg-amber-50/30 group transition-colors">
                    {/* Cột Ảnh */}
                    <TableCell className="text-center px-3">
                      <div className="w-14 h-14 rounded-lg border border-stone-100 bg-stone-50 overflow-hidden relative mx-auto flex items-center justify-center">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          // placeholder="blur" // Nếu muốn dùng blur placeholder
                          // blurDataURL="..." // Cần base64 image nhỏ
                          />
                        ) : (
                          <ImageIcon size={20} className="text-stone-300" />
                        )}
                      </div>
                    </TableCell>

                    {/* Cột Tên & Mô tả */}
                    <TableCell className="py-4">
                      <div className="font-semibold text-stone-900 text-sm">{item.name}</div>
                      {item.description && (
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed max-w-sm">
                          {item.description}
                        </p>
                      )}
                    </TableCell>

                    {/* Cột Nhóm */}
                    <TableCell>
                      <Badge variant="secondary" className="font-medium text-xs bg-stone-100 text-stone-700 border-none px-2.5 py-0.5 rounded-full">
                        {item.productCategory?.name || "Uncategorized"}
                      </Badge>
                    </TableCell>

                    {/* Cột Giá */}
                    <TableCell className="text-right font-bold text-base text-amber-900 tabular-nums px-4">
                      {/* Định dạng tiền tệ VND */}
                      {item.price.toLocaleString('vi-VN')} đ
                    </TableCell>

                    {/* Cột Trạng thái */}
                    <TableCell className="text-center">
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${item.isActive ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                        {item.isActive ? "Đang bán" : "Ngưng bán"}
                      </span>
                    </TableCell>

                    {/* Cột Actions */}
                    <TableCell className="text-right px-4">
                      <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="outline" onClick={() => openEdit(item)} className="h-8 px-3 text-xs border-stone-200 hover:bg-white hover:border-amber-300 hover:text-amber-800 shadow-none">
                          <Pencil size={13} className="mr-1.5" /> Sửa
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDeleteTarget(item)} className="h-8 px-3 text-xs text-red-600 border-red-100 bg-red-50/50 hover:bg-red-100 hover:border-red-200 shadow-none">
                          <Trash2 size={13} className="mr-1.5" /> Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* 4. Footer: Phân trang */}
          {meta && meta.lastPage > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-stone-100 bg-stone-50/30 tabular-nums">
              <span className="text-xs text-stone-400">
                Hiển thị món thứ <b>{(meta.currentPage - 1) * meta.perPage + 1}</b> đến <b>{Math.min(meta.currentPage * meta.perPage, meta.total)}</b> trên tổng số <b>{meta.total}</b> món
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!meta.prev || isLoading} className="h-8 text-xs px-4 bg-white">Trước</Button>
                <span className="text-xs font-semibold text-stone-700 mx-1">Trang {meta.currentPage} / {meta.lastPage}</span>
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))} disabled={!meta.next || isLoading} className="h-8 text-xs px-4 bg-white">Sau</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: Thêm Nhóm Món (Category) MỚI */}
      {/* ========================================================= */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl p-7">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Thêm nhóm món mới</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-stone-700">Tên nhóm món <span className="text-red-400">*</span></Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="VD: Cà phê, Trà hoa quả, Bánh ngọt..."
                className="h-11 text-sm border-stone-200 focus-visible:ring-amber-500"
                autoFocus
              />
              <p className="text-xs text-stone-400">Tên này sẽ hiển thị làm Tab phân loại ngoài menu chính.</p>
            </div>
          </div>

          <DialogFooter className="flex gap-3 sm:gap-2 mt-2">
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)} className="h-11 rounded-lg border-stone-200">Hủy</Button>
            <Button
              onClick={handleSaveCategory}
              disabled={!newCategoryName.trim() || isCreatingCategory}
              className="bg-black hover:bg-stone-800 text-white! h-11 rounded-lg px-6 gap-2"
            >
              {isCreatingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tạo nhóm món"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* ========================================================= */}
      {/* MODAL 2: Thêm/Sửa Món Ăn (Product) */}
      {/* ========================================================= */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl p-8 max-h-[90vh] hide-scrollbar flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {editingItem ? `Chỉnh sửa: ${editingItem.name}` : "Thêm món mới vào thực đơn"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 1. Hình ảnh và Tên/Giá */}
            <div className="flex gap-6 items-start">

              {/* Khu vực Up ảnh tương tác được */}
              <label htmlFor="thumbnail-upload" className="w-32 h-32 flex-shrink-0 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 flex flex-col items-center justify-center text-center p-3 cursor-pointer hover:border-amber-300 hover:bg-amber-50 transition relative overflow-hidden group">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <>
                    <ImageIcon size={28} className="text-stone-300 group-hover:text-amber-400" />
                    <span className="text-[11px] text-stone-400 mt-2 group-hover:text-amber-700">Tải ảnh lên<br />(Click)</span>
                  </>
                )}
                {previewUrl && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Đổi ảnh</span>
                  </div>
                )}
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-stone-700">Tên món ăn/đồ uống <span className="text-red-400">*</span></Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Bạc xỉu đá, Trà đào cam sả..." className="h-11 text-sm border-stone-200" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-stone-700">Nhóm món <span className="text-red-400">*</span></Label>
                    <Select value={form.categoryName} onValueChange={(v) => setForm({ ...form, categoryName: v })}>
                      <SelectTrigger className="h-11 text-sm border-stone-200 focus:ring-amber-500">
                        <SelectValue placeholder="Chọn nhóm" />
                      </SelectTrigger>
                      <SelectContent>
                        {TAB_CATEGORIES.filter((c) => c !== "Tất cả").map((c) => (
                          <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-stone-700">Giá bán (VNĐ) <span className="text-red-400">*</span></Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="VD: 35000"
                      className="h-11 text-sm border-stone-200 tabular-nums font-semibold text-amber-900"
                      min={0}
                      step={1000}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mô tả món */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-stone-700">Mô tả món ăn (Thành phần, hương vị...)</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="VD: Cà phê rang xay nguyên chất pha phin kết hợp sữa đặc Ông Thọ..."
                className="text-sm border-stone-200 min-h-[100px] resize-none leading-relaxed"
              />
            </div>

            {/* Trạng thái kinh doanh */}
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-stone-50 border border-stone-100 mt-4">
              <div>
                <div className="text-sm font-semibold text-stone-900">Trạng thái kinh doanh</div>
                <div className="text-xs text-stone-500 mt-0.5">{form.isActive ? "Món đang được mở bán công khai" : "Tạm ẩn món khỏi menu"}</div>
              </div>
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} className="data-[state=checked]:bg-amber-700" />
            </div>
          </div>

          <DialogFooter className="border-t border-stone-100 pt-6 mt-2 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 rounded-lg border-stone-200 px-6">Hủy</Button>
            <Button
              onClick={handleSave}
              disabled={!form.name.trim() || form.price === "" || isCreating || isUpdating}
              className="bg-amber-800 hover:bg-amber-900 text-white h-11 rounded-lg px-8 gap-2 shadow font-semibold"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {editingItem ? "Cập nhật món" : "Thêm vào thực đơn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 3: Xác nhận Xóa Món ăn */}
      {/* ========================================================= */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl p-7">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-700">Xác nhận xoá món</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-600 pt-2 leading-relaxed">
              Bạn có chắc chắn muốn xoá món <span className="font-semibold text-stone-950 bg-amber-100 px-1.5 py-0.5 rounded">"{deleteTarget?.name}"</span> khỏi thực đơn không?<br />
              Hành động này <b className="text-red-600">không thể hoàn tác</b> và món ăn sẽ biến mất khỏi Menu phía khách hàng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
            <AlertDialogCancel disabled={isDeleting} className="border-stone-200 h-11 rounded-lg">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white h-11 rounded-lg px-6 shadow-sm border-none">
              {isDeleting ? (
                <> <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang xoá... </>
              ) : (
                "Vẫn xoá món này"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}