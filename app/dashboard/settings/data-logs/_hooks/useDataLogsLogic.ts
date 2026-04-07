import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../_services/dataLogs";

export function useDataLogsLogic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const {
    data: logsData, isLoading, refetch, isFetching,
  } = useQuery({
    queryKey: ["audit_logs", searchQuery, actionFilter, page],
    queryFn: () => getAuditLogs(searchQuery, actionFilter, page),
  });

  const logs = logsData?.results || [];
  const totalCount = logsData?.count || 0;
  const hasNext = !!logsData?.next;
  const hasPrev = !!logsData?.previous;

  return {
    searchQuery, setSearchQuery,
    actionFilter, setActionFilter,
    page, setPage,
    logs, totalCount, hasNext, hasPrev,
    isLoading, isFetching, refetch
  };
}
