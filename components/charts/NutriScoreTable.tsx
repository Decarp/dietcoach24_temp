"use client";

import { useCounterStore } from "@/providers/useStoreProvider";
import { NutrientTableItem, NutrientTableResponseItem } from "@/types/types";
import { fetchNutrientTable } from "@/utils/fetchNutrientTable";
import { mapNutriScoreTableResponse } from "@/utils/mapNutriScoreTableResponse";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import type {
  ColDef,
  GetDataPath,
  ICellRendererParams,
} from "@ag-grid-community/core";
import { ModuleRegistry } from "@ag-grid-community/core";
import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
} from "react";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  RichSelectModule,
]);

export const NutriScoreTable = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  const gridRef = useRef<AgGridReact>(null);

  const { selectedCategories, selectedBasketIds, updateCategories } =
    useCounterStore((state) => state);

  const { isLoading, error, data } = useQuery<NutrientTableResponseItem[]>({
    queryKey: ["nutrientTable", patientId, selectedBasketIds],
    queryFn: () =>
      fetchNutrientTable(
        patientId,
        selectedBasketIds,
        session?.accessToken || ""
      ),
    enabled: selectedBasketIds.length > 0 && !!session?.accessToken,
  });

  const handleClick = (category: string) => {
    if (category.includes(" > ")) {
      const sub = category.split(" > ")[1];
      updateCategories(sub, "sub", true);
    } else {
      updateCategories(category, "major", true);
    }
  };

  const [rowData, setRowData] = useState<NutrientTableItem[]>([]);

  useEffect(() => {
    if (data) {
      setRowData(mapNutriScoreTableResponse(data));
    }
  }, [data]);

  const [colDefs] = useState<ColDef[]>([
    {
      headerName: "Menge (g)",
      field: "Quantity",
      width: 120,
    },
    {
      headerName: "Energie (kJ)",
      field: "EnergyKJ",
      width: 140,
    },
    {
      headerName: "Energie (%)",
      field: "EnergyShare",
      width: 120,
    },
    {
      headerName: "Zucker",
      field: "Sugars",
      width: 120,
    },
    {
      headerName: "Salz",
      field: "Salt",
      width: 120,
    },
    {
      headerName: "Gesättigte Fettsäuren",
      field: "Saturates",
      width: 220,
    },
    {
      headerName: "Nahrungsfasern",
      field: "Fibres",
      width: 180,
    },
    {
      headerName: "Obst & Gemüse",
      field: "FVL",
      width: 160,
    },
    {
      headerName: "Protein",
      field: "Proteins",
      width: 120,
    },
    {
      field: "",
      pinned: "right",
      cellRenderer: (params: ICellRendererParams) => (
        <CheckboxCellRenderer {...params} onCheckboxClick={handleClick} />
      ),
      width: 47,
    },
  ]);

  const getDataPath = useCallback<GetDataPath>((data) => data.category, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "Employee",
      width: 180,
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
    <div className="w-full mx-auto border border-gray-300">
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
          getDataPath={getDataPath}
          treeData
          autoGroupColumnDef={autoGroupColumnDef}
        />
      </div>
    </div>
  );
};

const CategoryCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
  data: { Category },
}) => {
  // Check if category is defined and is an array
  const isMajorCategory = Array.isArray(Category) && Category.length === 1;
  const categoryText = isMajorCategory ? Category[0] : Category?.[1] ?? "";

  return (
    <div className="flex flex-row-reverse items-center justify-start gap-2">
      <div className="flex flex-col">
        <span
          className={`${
            isMajorCategory
              ? "text-sm text-gray-700 font-semibold"
              : "text-sm text-gray-500"
          } whitespace-normal text-wrap max-w-[120px] break-words`}
        >
          {categoryText}
        </span>
      </div>
    </div>
  );
};

const CheckboxCellRenderer: FunctionComponent<
  CustomCellRendererProps & {
    onCheckboxClick: (category: string) => void;
  }
> = ({ data, onCheckboxClick }) => {
  const { selectedCategories } = useCounterStore((state) => state);

  // Check if category exists and is an array before calling join
  const category = Array.isArray(data?.Category)
    ? data.Category.join(" > ")
    : "";

  const isChecked = category.includes(" > ")
    ? selectedCategories.sub.includes(category.split(" > ")[1])
    : selectedCategories.major.includes(category);

  const handleClick = () => {
    onCheckboxClick(category);
  };

  useEffect(() => {
    const checkboxElement = document.querySelector(
      `input[type="checkbox"][data-category="${category}"]`
    ) as HTMLInputElement;

    if (checkboxElement) {
      checkboxElement.checked = isChecked;
    }
  }, [selectedCategories, category, isChecked]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          data-category={category}
          checked={isChecked}
          onChange={handleClick}
        />
      </div>
    </div>
  );
};

export default CheckboxCellRenderer;
