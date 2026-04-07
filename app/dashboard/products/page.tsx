"use client";

import { motion } from "framer-motion";
import { useProductsLogic } from "./_hooks/useProductsLogic";
import { ProductsHeader } from "./_components/ProductsHeader";
import { ProductsTable } from "./_components/ProductsTable";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProductsPage() {
  const logic = useProductsLogic();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8">
      <ProductsHeader
        isAddModalOpen={logic.isAddModalOpen} setIsAddModalOpen={logic.setIsAddModalOpen}
        isEditModalOpen={logic.isEditModalOpen} setIsEditModalOpen={logic.setIsEditModalOpen}
        selectedProduct={logic.selectedProduct}
        isFetching={logic.isFetching} refetch={logic.refetch}
      />

      <ProductsTable
        searchQuery={logic.searchQuery} handleSearch={logic.handleSearch}
        count={logic.count} isLoading={logic.isLoading}
        products={logic.products} page={logic.page} setPage={logic.setPage}
        hasPrevious={logic.hasPrevious} hasNext={logic.hasNext}
        setSelectedProduct={logic.setSelectedProduct}
        setIsEditModalOpen={logic.setIsEditModalOpen}
        handleDelete={logic.handleDelete}
        itemVariants={item}
      />
    </motion.div>
  );
}
