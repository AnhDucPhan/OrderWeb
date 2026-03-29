'use client';

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Plus, Pencil, Trash2, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  useGetMaterialsQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation
} from "@/services/materialApi";
// 👇 Import thêm hàm createCategory từ API
import { useGetCategoriesQuery, useCreateCategoryMutation } from "@/services/categoryApi";

interface Material {
  id: number;
  name: string;
  categoryId: number;
  category?: { id: number; name: string };
  unit: string;
  stock: number;
  isActive: boolean;
}

interface MaterialForm {
  name: string;
  category: string;
  unit: string;
  stock: number | string;
  isActive: boolean;
}

const PAGE_SIZE: number = 8;
const EMPTY_FORM: MaterialForm = { name: "", category: "", unit: "Hộp", stock: 0, isActive: true };

export default function MaterialAdmin() {
  const [page, setPage] = useState<number>(1);
  const [tab, setTab] = useState<string>("Tất cả");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // State cho Modal Material
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [form, setForm] = useState<MaterialForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);

  // 👇 State cho Modal Category
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const { data: categoriesData = [] } = useGetCategoriesQuery();
  const CATEGORIES: string[] = ["Tất cả", ...categoriesData.map(c => c.name)];

  const [createMaterial, { isLoading: isCreating }] = useCreateMaterialMutation();
  const [updateMaterial, { isLoading: isUpdating }] = useUpdateMaterialMutation();
  const [deleteMaterial, { isLoading: isDeleting }] = useDeleteMaterialMutation();

  // 👇 Khai báo hook thêm danh mục
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tab, statusFilter]);

  const selectedTabCategory = categoriesData.find(c => c.name === tab);
  const filterCategoryId = tab === "Tất cả" ? undefined : String(selectedTabCategory?.id);

  const { data: responseData, isLoading } = useGetMaterialsQuery({
    page,
    perPage: PAGE_SIZE,
    q: debouncedSearch,
    categoryId: filterCategoryId,
    status: statusFilter === "all" ? undefined : statusFilter
  });

  const materialsList: Material[] = responseData?.data || [];
  const meta = responseData?.meta;

  function openAdd(): void {
    setEditingMaterial(null);
    const defaultCat = categoriesData.length > 0 ? categoriesData[0].name : "";
    setForm({ ...EMPTY_FORM, category: defaultCat });
    setDialogOpen(true);
  }

  function openEdit(m: Material): void {
    setEditingMaterial(m);
    setForm({
      name: m.name,
      category: m.category?.name || "",
      unit: m.unit,
      stock: m.stock,
      isActive: m.isActive
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || form.stock === "" || !form.category) return;
    const selectedFormCat = categoriesData.find(c => c.name === form.category);

    const payload = {
      name: form.name,
      unit: form.unit,
      stock: Number(form.stock),
      isActive: form.isActive,
      categoryId: selectedFormCat?.id || 0
    };

    try {
      if (editingMaterial) {
        await updateMaterial({ id: editingMaterial.id, data: payload }).unwrap();
        toast.success("Cập nhật nguyên vật liệu thành công!");
      } else {
        await createMaterial(payload).unwrap();
        toast.success("Thêm nguyên vật liệu thành công!");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMaterial(deleteTarget.id).unwrap();
      toast.success("Đã xóa nguyên vật liệu!");
      setDeleteTarget(null);
      if (materialsList.length === 1 && page > 1) setPage(page - 1);
    } catch (error) {
      toast.error("Lỗi khi xóa!");
    }
  }

  // 👇 Hàm lưu Danh mục mới
  async function handleSaveCategory() {
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName.trim() }).unwrap();
      toast.success("Thêm phân loại mới thành công!");
      setCategoryDialogOpen(false);
      setNewCategoryName(""); // Reset form
    } catch (error: any) {
      // Bắt lỗi nếu trùng tên danh mục
      toast.error(error?.data?.message || "Tên danh mục này đã tồn tại!");
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header với 2 nút bấm */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Quản lý Kho (Nguyên vật liệu)</h1>
            <p className="text-sm text-stone-400 mt-0.5">Đang có {meta?.total || 0} mặt hàng trong kho</p>
          </div>
          <div className="flex items-center gap-2">
            {/* 👇 Nút mở Modal thêm Phân loại */}
            <Button variant="outline" onClick={() => setCategoryDialogOpen(true)} className="gap-2 shadow-sm text-stone-700 bg-white hover:bg-stone-100">
              <Plus size={16} /> Thêm phân loại
            </Button>
            <Button onClick={openAdd} className="bg-black hover:bg-stone-800 text-white! gap-2 shadow-sm">
              <Plus size={16} /> Nhập nguyên liệu
            </Button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-4">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder="Tìm theo tên nguyên liệu..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8 bg-white border-stone-200 text-sm h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-9 bg-white border-stone-200 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang dùng</SelectItem>
              <SelectItem value="hidden">Ngừng nhập</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="border-b border-stone-100 px-4 pt-1">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="bg-transparent h-auto p-0 gap-0 overflow-x-auto flex-nowrap hide-scrollbar">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat} value={cat}
                    className="rounded-none whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:text-amber-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-stone-500 text-sm px-4 py-3 h-auto font-normal"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-stone-50/60">
                <TableHead className="text-xs text-stone-400 font-medium w-[40%]">Tên nguyên liệu</TableHead>
                <TableHead className="text-xs text-stone-400 font-medium w-32">Phân loại</TableHead>
                <TableHead className="text-xs text-stone-400 font-medium w-32 text-right">Tồn kho</TableHead>
                <TableHead className="text-xs text-stone-400 font-medium w-32 text-center">Trạng thái</TableHead>
                <TableHead className="text-xs text-stone-400 font-medium w-32 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="animate-spin mx-auto mb-2 text-stone-400" />Đang tải...</TableCell></TableRow>
              ) : materialsList.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-stone-400">Kho trống hoặc không tìm thấy.</TableCell></TableRow>
              ) : (
                materialsList.map((m) => (
                  <TableRow key={m.id} className="hover:bg-stone-50/70 group">
                    <TableCell className="font-medium text-stone-800 text-sm">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-stone-400" />
                        {m.name}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="font-normal text-xs">{m.category?.name}</Badge></TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={m.stock <= 0 ? "text-red-500" : "text-stone-700"}>
                        {m.stock} {m.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${m.isActive ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                        {m.isActive ? "Đang dùng" : "Ngừng nhập"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="outline" onClick={() => openEdit(m)} className="h-7 px-2.5 text-xs">
                          <Pencil size={12} className="mr-1" /> Sửa
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDeleteTarget(m)} className="h-7 px-2.5 text-xs text-red-500 hover:bg-red-50">
                          <Trash2 size={12} className="mr-1" /> Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Phân trang */}
          {meta && meta.lastPage > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-stone-100">
              <span className="text-xs text-stone-400">
                Hiển thị {(meta.currentPage - 1) * meta.perPage + 1}–{Math.min(meta.currentPage * meta.perPage, meta.total)}
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!meta.prev} className="h-7 text-xs">Trước</Button>
                <span className="text-xs font-medium">Trang {meta.currentPage} / {meta.lastPage}</span>
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))} disabled={!meta.next} className="h-7 text-xs">Sau</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. Modal Thêm Phân Loại (Category) MỚI */}
      {/* ========================================================= */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Thêm phân loại mới</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-stone-600">Tên phân loại <span className="text-red-400">*</span></Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="VD: Cà phê, Sữa, Syrup..."
                className="h-10 text-sm"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Hủy</Button>
            <Button
              onClick={handleSaveCategory}
              disabled={!newCategoryName.trim() || isCreatingCategory}
              className="bg-white! text-black!"
            >
              {isCreatingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* ========================================================= */}
      {/* 2. Modal Thêm/Sửa Nguyên Vật Liệu CŨ */}
      {/* ========================================================= */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMaterial ? "Chỉnh sửa nguyên liệu" : "Nhập nguyên liệu mới"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-stone-600">Tên nguyên liệu <span className="text-red-400">*</span></Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Sữa đặc Ông Thọ" className="h-10 text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-stone-600">Phân loại</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c !== "Tất cả").map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-stone-600">Đơn vị tính <span className="text-red-400">*</span></Label>
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="VD: Hộp, Kg, Lít..." className="h-10 text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-stone-600">Số lượng (Tồn kho)</Label>
              <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="h-10 text-sm" />
            </div>

            <div className="flex items-center justify-between py-1 border-t pt-3 mt-2">
              <div>
                <div className="text-sm font-medium">Trạng thái sử dụng</div>
                <div className="text-xs text-stone-400">{form.isActive ? "Đang nhập và dùng" : "Ngừng sử dụng"}</div>
              </div>
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} className="data-[state=checked]:bg-amber-700" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || form.stock === "" || isCreating || isUpdating} className="bg-amber-800 hover:bg-amber-900 text-white">
              {isCreating || isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu dữ liệu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* 3. Modal Confirm Xóa CŨ */}
      {/* ========================================================= */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xoá <span className="font-medium text-stone-800">"{deleteTarget?.name}"</span> khỏi kho không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
              {isDeleting ? "Đang xoá..." : "Xoá luôn"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}