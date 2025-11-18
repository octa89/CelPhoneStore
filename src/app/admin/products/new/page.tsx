import ProductForm from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">Agregar Nuevo Producto</h1>
        <p className="text-text-muted">Crea un nuevo producto en tu catálogo</p>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}
