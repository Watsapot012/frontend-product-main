import './App.css'
import { useState, useEffect } from "react";
import { Package, Pencil, Trash2, PlusCircle, X, Sparkles, Layers } from "lucide-react";

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

 
  const totalValue = products.reduce((acc, item) => acc + Number(item.price || 0), 0);

  return (
    <>
      <main className="min-h-screen bg-[#090D16] font-sans antialiased text-slate-200 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-6">
          
         
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-[#111827] p-6 border border-slate-800/80 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Package className="size-6 stroke-[1.75]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Product Dashboard
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[11px] font-semibold text-indigo-400">
                    <Sparkles className="size-3" /> Live
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  ระบบจัดการรายการสินค้าและคำนวณราคาสินค้าอัตโนมัติ
                </p>
              </div>
            </div>

           
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#1A2332] border border-slate-800 px-4 py-2 text-right">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">รายการทั้งหมด</span>
                <span className="text-base font-bold text-slate-100">{products.length} รายการ</span>
              </div>
              <div className="rounded-xl bg-[#1A2332] border border-slate-800 px-4 py-2 text-right">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">มูลค่าสินค้ารวม</span>
                <span className="text-base font-bold text-indigo-400">{totalValue.toLocaleString()} ฿</span>
              </div>
            </div>
          </header>

        
          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/30 p-4 text-sm text-rose-400 flex items-center justify-between shadow-sm">
              <span>เกิดข้อผิดพลาด: {error}</span>
            </div>
          )}

        
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
           
            <section className="lg:col-span-4 lg:sticky lg:top-8 rounded-2xl border border-slate-800/80 bg-[#111827] p-6 shadow-xl">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4 mb-5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {editingId ? <Pencil className="size-4" /> : <PlusCircle className="size-4" />}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {editingId ? "แก้ไขรายการสินค้า" : "เพิ่มรายการใหม่"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {editingId ? "อัปเดตชื่อและราคาสินค้า" : "กรอกรายละเอียดเพื่อบันทึก"}
                  </p>
                </div>
              </div>

              <form
                className="space-y-4"
                onSubmit={editingId ? handleUpdateProduct : handleCreateProduct}
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    ชื่อสินค้า <span className="text-rose-400">*</span>
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-800 bg-[#0B0F19] px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-[#0B0F19] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น Mechanical Keyboard"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    ราคา (บาท) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-800 bg-[#0B0F19] px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-[#0B0F19] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="เช่น 2500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    className="flex-1 flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-500"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : editingId ? (
                      <Pencil className="size-4" />
                    ) : (
                      <PlusCircle className="size-4" />
                    )}
                    <span>
                      {isSubmitting
                        ? "กำลังบันทึก..."
                        : editingId
                          ? "บันทึกการแก้ไข"
                          : "บันทึกสินค้า"}
                    </span>
                  </button>

                  {editingId && (
                    <button
                      className="flex h-10 items-center justify-center gap-1 rounded-xl border border-slate-800 bg-[#1A2332] px-3.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all"
                      type="button"
                      onClick={cancelEditing}
                      disabled={isSubmitting}
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </form>
            </section>

           
            <section className="lg:col-span-8 rounded-2xl border border-slate-800/80 bg-[#111827] shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-indigo-400" />
                  <h2 className="text-sm font-bold text-white">คลังสินค้าปัจจุบัน</h2>
                </div>
                <span className="text-xs text-slate-500">
                  อัปเดตล่าสุดเรียลไทม์
                </span>
              </div>

              {loading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                  <span className="loading loading-spinner loading-md text-indigo-400" />
                  <span className="text-xs font-medium text-slate-500">กำลังดึงข้อมูลสินค้า...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-800/50 text-slate-500 mb-3 border border-slate-800">
                    <Package className="size-6 stroke-[1.5]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">ยังไม่มีรายการสินค้า</p>
                  <p className="text-xs text-slate-500 mt-1">เริ่มต้นเพิ่มสินค้าได้ที่ฟอร์มด้านข้าง</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#172033] border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="py-3.5 pl-6">ID</th>
                        <th className="py-3.5">ชื่อสินค้า</th>
                        <th className="py-3.5">ราคา</th>
                        <th className="py-3.5 pr-6 text-right">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {products.map((item) => (
                        <tr key={item.id} className="group transition-colors hover:bg-slate-800/40">
                          <td className="py-4 pl-6 font-mono text-xs text-slate-500">
                            #{item.id}
                          </td>
                          <td className="py-4 font-semibold text-slate-200">
                            {item.name}
                          </td>
                          <td className="py-4">
                            <span className="inline-flex items-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400">
                              {Number(item.price).toLocaleString()} ฿
                            </span>
                          </td>
                          <td className="py-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all"
                                onClick={() => startEditing(item)}
                                aria-label={`แก้ไขสินค้า ${item.name}`}
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                                onClick={() => handleDeleteProduct(item.id)}
                                aria-label={`ลบสินค้า ${item.name}`}
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

export default App;
