import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import type { ColDef, GetDataPath } from "@ag-grid-community/core";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { useCallback, useMemo, useRef, useState } from "react";

import { CheckboxCellRenderer } from "./cellRenderers/CheckboxCellRenderer";
import { CategoryCellRenderer } from "./cellRenderers/CategoryCellRenderer";
import { getNutriScoreTableData } from "@/getData/getNutriScoreTableData";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  RichSelectModule,
]);

export const NutriScoreTable = () => {
  const gridRef = useRef<AgGridReact>(null);

  const [colDefs] = useState<ColDef[]>([
    {
      headerName: "Menge (g)",
      field: "quantity",
      width: 120,
    },
    {
      headerName: "Energie (kJ)",
      field: "energyKj",
      width: 140,
    },
    {
      headerName: "Energie",
      field: "energy",
      width: 120,
    },
    {
      headerName: "Zucker",
      field: "sugar",
      width: 120,
    },
    {
      headerName: "Gesättigte Fettsäuren",
      field: "saturatedFat",
      width: 220,
    },
    {
      headerName: "Salz",
      field: "sodium",
      width: 120,
    },
    {
      headerName: "Obst & Gemüse",
      field: "fruitVegetables",
      width: 160,
    },
    {
      headerName: "Nahrungsfasern",
      field: "fiber",
      width: 180,
    },
    {
      headerName: "Protein",
      field: "protein",
      width: 120,
    },
    {
      field: "Filter",
      pinned: "right",
      cellRenderer: CheckboxCellRenderer,
      width: 80,
    },
  ]);

  const [rowData] = useState(getNutriScoreTableData());
  const getDataPath = useCallback<GetDataPath>((data) => data.category, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "Employee",
      width: 210,
      pinned: "left",
      sort: "asc",
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: CategoryCellRenderer,
      },
    };
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto border border-gray-300">
      <div
        className="ag-theme-quartz"
        style={{
          height:
            "calc(60vh - var(--layout-grid-header-height) - var(--layout-grid-margin))",
        }}
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={colDefs}
          rowData={rowData}
          groupDefaultExpanded={-1}
          getDataPath={getDataPath}
          treeData
          autoGroupColumnDef={autoGroupColumnDef}
        />
      </div>
    </div>
  );
};
