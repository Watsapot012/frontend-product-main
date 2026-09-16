import './App.css'
import { useState, useEffect } from "react";
import { Package, Pencil, Trash2, PlusCircle, X } from "lucide-react";

function App() {
  const API_URL = import.meta.env.VITE_API_URL + "/api/products";
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      if(!response.ok) throw new Error("ไม่สามารถดึงข้อมูลได้")
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    //fetch data from API
    fetchProduct();
  }, [])

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if(!name || !price) {
      alert("กรูณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(API_URL,{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({name:name, price:Number(price) }),
      });
      if(!response.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      setName("")
      setPrice("")
      fetchProduct();
    }
    catch (error) {
      alert(error.message)
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("กรูณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/${editingId}`,{
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name:name, price: Number(price) }),
      });
      if(!response.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        setProducts((currentProducts) => 
          currentProducts.map((products) => 
            products.id === editingId 
              ? {...products, name:name, price:Number(price) }
              : products,
        ),
      );
    setName("");
    setPrice("");
    setEditingId(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteProduct = async (id) => {
    if(!confirm("คุณต้องการลบรายการสินค้านี้หรือไม่")) return
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if(!response.ok) throw new Error("ลบข้อมูลไม่สำเร็จ");
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      alert(error.message);
    }
  }

  const startEditing = (product) => {
    setEditingId(product.id),
    setName(product.name),
    setPrice(product.price)
  };
  const cancelEditing = () => {
    setName("");
    setPrice("");
    setEditingId(null);
  };

  return (
    <>
      <main className="min-h-screen bg-[#fafafa] font-sans antialiased text-slate-800 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          
          {/* Header Banner - Minimal Clean Style */}
          <header className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Product Management System
                  </span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  ระบบจัดการรายการสินค้า
                </h1>
                <p className="text-sm text-slate-500">
                  จัดการข้อมูลสินค้าและราคาสินค้าในระบบแบบเรียลไทม์
                </p>
              </div>

              <div className="hidden sm:flex size-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                <Package className="size-5 stroke-[1.75]" />
              </div>
            </div>
          </header>

          {/* Form Section - Minimal Form Box */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                  {editingId ? <Pencil className="size-4 stroke-[1.75]" /> : <PlusCircle className="size-4 stroke-[1.75]" />}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {editingId ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingId ? "ระบุข้อมูลใหม่ที่ต้องการแก้ไข" : "ป้อนรายละเอียดสินค้าที่ต้องการเพิ่ม"}
                  </p>
                </div>
              </div>
            </div>

            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_0.6fr_auto] md:items-end"
              onSubmit={editingId ? handleUpdateProduct : handleCreateProduct}
            >
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  ชื่อสินค้า
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น Gaming Keyboard"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  ราคา (บาท)
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="เช่น 1500"
                />
              </div>

              <div className="flex gap-2 pt-2 md:pt-0">
                <button
                  className="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:bg-slate-300 md:flex-none"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : editingId ? (
                    <Pencil className="size-4 stroke-[1.75]" />
                  ) : (
                    <PlusCircle className="size-4 stroke-[1.75]" />
                  )}

                  <span>
                    {isSubmitting
                      ? "กำลังบันทึก..."
                      : editingId
                        ? "อัปเดต"
                        : "เพิ่มสินค้า"}
                  </span>
                </button>

                {editingId && (
                  <button
                    className="flex h-[42px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSubmitting}
                  >
                    <X className="size-4 stroke-[1.75]" />
                    <span>ยกเลิก</span>
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Error Alert */}
          {error && (
            <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-rose-600">
              <span>เกิดข้อผิดพลาด: {error}</span>
            </div>
          )}

          {/* Table / Empty State */}
          {loading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <span className="loading loading-spinner loading-md text-slate-400" />
              <span className="text-xs font-medium text-slate-400">กำลังโหลดรายการ...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-3">
                <Package className="size-6 stroke-[1.5]" />
              </div>
              <p className="text-sm font-medium text-slate-900">ไม่มีรายการสินค้าในระบบ</p>
              <p className="text-xs text-slate-400 mt-1">เริ่มต้นเพิ่มรายการสินค้าแรกโดยใช้แบบฟอร์มด้านบน</p>
            </div>
          ) : (
            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-slate-900">รายการสินค้าทั้งหมด</h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {products.length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-medium uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3.5 pl-6">รหัส</th>
                      <th className="py-3.5">ชื่อสินค้า</th>
                      <th className="py-3.5">ราคา</th>
                      <th className="py-3.5 pr-6 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((item) => (
                      <tr key={item.id} className="group transition-colors hover:bg-slate-50/60">
                        <td className="py-4 pl-6 font-mono text-xs font-medium text-slate-400">
                          #{item.id}
                        </td>
                        <td className="py-4 font-medium text-slate-800">
                          {item.name}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            Number(item.price) > 5000 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}>
                            {Number(item.price).toLocaleString()} ฿
                          </span>
                        </td>
                        <td className="py-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                            <button
                              className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
                              onClick={() => startEditing(item)}
                              aria-label={`แก้ไขสินค้า ${item.name}`}
                            >
                              <Pencil className="size-4 stroke-[1.75]" />
                            </button>
                            <button
                              className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                              onClick={() => handleDeleteProduct(item.id)}
                              aria-label={`ลบสินค้า ${item.name}`}
                            >
                              <Trash2 className="size-4 stroke-[1.75]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}

export default App;
