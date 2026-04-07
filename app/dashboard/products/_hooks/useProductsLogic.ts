import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProducts, deleteProduct } from "../_services/products";

export function useProductsLogic() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["products", searchQuery, page],
    queryFn: () => getProducts(searchQuery, page),
  });

  const isArray = Array.isArray(data);
  const products = isArray ? data : data?.results || [];
  const count = isArray ? data.length : data?.count || 0;
  const hasNext = !isArray && !!data?.next;
  const hasPrevious = !isArray && !!data?.previous;

  const handleDelete = (id: string) => {
    toast.promise(deleteProduct(id), {
      loading: "Archiving product...",
      success: () => {
        refetch();
        return "Product archived successfully";
      },
      error: "Failed to archive product",
    });
  };

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  return {
    page, setPage,
    searchQuery, handleSearch,
    isAddModalOpen, setIsAddModalOpen,
    selectedProduct, setSelectedProduct,
    isEditModalOpen, setIsEditModalOpen,
    products, count, hasNext, hasPrevious,
    isLoading, isFetching, refetch, handleDelete
  };
}
