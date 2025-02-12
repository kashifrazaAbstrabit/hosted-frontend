import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import NoDataFound from "./NoDataFound";
import Loading from "./Loading";

// Reusable Table Component
interface TableProps {
  title: string;
  rows: any[];
  loading: boolean;
  columns: GridColDef[];
  fetchData: () => void;
  handleDeleteRow: (id: number, email: string) => void;
}

const ReusableTable: React.FC<TableProps> = ({
  title,
  rows,
  loading,
  columns,

}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredRows, setFilteredRows] = useState(rows);

  useEffect(() => {
    const filtered = rows.filter((row: any) =>
      row.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchQuery, rows]);

  return (
    <div className="table-container">
      <div className="flex items-center justify-between gap-x-2 mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex bg-white items-center px-2 border rounded">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email address"
            className="outline-none px-2 py-1 text-sm"
          />
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        {filteredRows.length > 0 ? (
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            rowHeight={67}
          />
        ) : loading ? (
          <Loading />
        ) : (
          <NoDataFound />
        )}
      </div>
    </div>
  );
};

export default ReusableTable;
