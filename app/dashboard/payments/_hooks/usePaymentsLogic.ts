import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../_services/payments";

export function usePaymentsLogic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: payments, isLoading, refetch, isFetching,
  } = useQuery({
    queryKey: ["payments", searchQuery],
    queryFn: () => getPayments(searchQuery),
  });

  const totalPaid = payments?.reduce(
    (acc: number, p: any) => p.actual_payment_date ? acc + parseFloat(p.amount_paid || 0) : acc, 0
  ) || 0;
  const pendingAmount = payments?.reduce(
    (acc: number, p: any) => !p.actual_payment_date ? acc + parseFloat(p.amount_paid || 0) : acc, 0
  ) || 0;

  return {
    searchQuery, setSearchQuery,
    isAddModalOpen, setIsAddModalOpen,
    payments, totalPaid, pendingAmount,
    isLoading, isFetching, refetch
  };
}
