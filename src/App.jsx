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
      <main className="min-h-screen bg-base-200/50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* Header Banner */}
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-secondary p-6 text-primary-content shadow-2xl sm:p-10">
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-white/20 backdrop-blur-md ring-1 ring-white/30 shadow-inner">
                    <Package className="size-6 text-white" />
                  </div>
                  <span className="badge badge-lg border-white/30 bg-white/15 backdrop-blur-md text-white font-medium">
                    Product
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Product Management System
                </h1>
                <p className="mt-2.5 max-w-xl text-sm font-light text-primary-content/80 sm:text-base">
                  จัดการสินค้าและราคาได้อย่างรวดเร็วและเป็นระเบียบในที่เดียว
                </p>
              </div>
            </div>
          </header>

          {/* Form Section */}
          <section className="card border border-base-200 bg-base-100/80 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="card-body p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3 border-b border-base-200 pb-4">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <PlusCircle className="size-6" />
                </div>
                <div>
                  <h2 className="card-title text-xl font-bold">
                    {editingId ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}
                  </h2>
                  <p className="text-xs text-base-content/60 sm:text-sm">
                    {editingId ? "กรอกข้อมูลใหม่เพื่ออัปเดตรายการสินค้า" : "กรอกข้อมูลเพื่อเพิ่มรายการเข้าสู่ระบบ"}
                  </p>
                </div>
              </div>

              <form
                className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_0.65fr_auto] md:items-end"
                onSubmit={editingId ? handleUpdateProduct : handleCreateProduct}
              >
                <label className="form-control w-full">
                  <span className="label-text mb-1.5 font-semibold text-base-content/80">ชื่อสินค้า</span>
                  <input
                    className="input input-bordered w-full focus:input-primary transition-all duration-200"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น Gaming Keyboard"
                  />
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-1.5 font-semibold text-base-content/80">ราคา (บาท)</span>
                  <input
                    className="input input-bordered w-full focus:input-primary transition-all duration-200"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="เช่น 1500"
                  />
                </label>

                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    className="btn btn-primary flex-1 md:flex-none shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : editingId ? (
                      <Pencil className="size-4" />
                    ) : (
                      <PlusCircle className="size-4" />
                    )}

                    {isSubmitting
                      ? "กำลังบันทึก..."
                      : editingId
                        ? "บันทึกการแก้ไข"
                        : "บันทึกข้อมูล"}
                  </button>

                  {editingId && (
                    <button
                      className="btn btn-ghost border border-base-300 hover:bg-base-200"
                      type="button"
                      onClick={cancelEditing}
                      disabled={isSubmitting}
                    >
                      <X className="size-4" /> ยกเลิก
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error shadow-lg border border-error/20">
              <span className="font-medium">เกิดข้อผิดพลาด : {error} </span>
            </div>
          )}

          {/* Product Content States */}
          {loading ? (
            <div className="flex min-h-60 flex-col gap-3 items-center justify-center rounded-3xl border border-base-200 bg-base-100 shadow-sm">
              <span className="loading loading-dots loading-lg text-primary" />
              <span className="text-sm font-medium text-base-content/60">กำลังโหลดข้อมูล...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="card border-2 border-dashed border-base-300 bg-base-100/50 shadow-sm">
              <div className="card-body items-center py-16 text-center">
                <div className="rounded-full bg-base-200 p-4 mb-2">
                  <Package className="size-10 text-base-content/40" />
                </div>
                <h2 className="card-title text-xl font-bold">ยังไม่มีข้อมูลสินค้า</h2>
                <p className="text-sm text-base-content/60 max-w-xs">
                  เริ่มต้นด้วยการกรอกแบบฟอร์มด้านบนเพื่อเพิ่มสินค้าใหม่รายการแรกของคุณ
                </p>
              </div>
            </div>
          ) : (
            <section className="card border border-base-200 bg-base-100 shadow-xl overflow-hidden">
              <div className="card-body p-0">
                <div className="flex items-center justify-between border-b border-base-200 px-6 py-5 sm:px-8">
                  <div>
                    <h2 className="card-title text-xl font-bold">รายการสินค้าทั้งหมด</h2>
                    <p className="text-xs text-base-content/60 sm:text-sm">
                      มีสินค้าอยู่ในระบบ {products.length} รายการ
                    </p>
                  </div>
                  <span className="badge badge-primary badge-lg font-bold shadow-sm">
                    {products.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead className="bg-base-200/60 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                      <tr>
                        <th className="py-4 pl-6 sm:pl-8">รหัส</th>
                        <th className="py-4">สินค้า</th>
                        <th className="py-4">ราคา</th>
                        <th className="py-4 pr-6 text-right sm:pr-8">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-200">
                      {products.map((item) => (
                        <tr key={item.id} className="hover:bg-base-200/40 transition-colors">
                          <td className="pl-6 font-mono text-xs font-semibold text-base-content/50 sm:pl-8">
                            #{item.id}
                          </td>
                          <td className="font-semibold text-base-content/90">{item.name}</td>
                          <td>
                            <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-sm font-bold text-success">
                              {Number(item.price).toLocaleString()} ฿
                            </span>
                          </td>
                          <td className="pr-6 text-right sm:pr-8">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10 transition-colors"
                                onClick={() => startEditing(item)}
                                aria-label={`แก้ไขสินค้า ${item.name}`}
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10 transition-colors"
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
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}

export default App;
