import { getNutriScoreTableData } from "@/getData/getNutriScoreTableData";
import { useCounterStore } from "@/providers/useStoreProvider";
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
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  type FunctionComponent,
} from "react";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  RichSelectModule,
]);

export const NutriScoreTable = () => {
  const gridRef = useRef<AgGridReact>(null);

  const { selectedCategories, updateCategories } = useCounterStore(
    (state) => state
  );

  const handleClick = (category: string) => {
    if (category.includes(" > ")) {
      const sub = category.split(" > ")[1];
      updateCategories(sub, "sub");
    } else {
      updateCategories(category, "major");
    }
    console.log("Selected Categories after Click", selectedCategories);
  };

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
      field: "",
      pinned: "right",
      cellRenderer: (params: ICellRendererParams) => (
        <CheckboxCellRenderer {...params} onCheckboxClick={handleClick} />
      ),
      width: 47,
    },
  ]);

  const [rowData] = useState(getNutriScoreTableData());
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
  data: { category },
}) => {
  const isMajorCategory = category.length === 1;
  const categoryText = isMajorCategory ? category[0] : category[1];

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
  const category = data.category.join(" > ");
  const isChecked = category.includes(" > ")
    ? selectedCategories.sub.includes(category.split(" > ")[1])
    : selectedCategories.major.includes(category);

  const handleClick = () => {
    onCheckboxClick(category);
  };

  useEffect(() => {
    // This effect will run whenever selectedCategories change
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
          className=" h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          data-category={category}
          checked={isChecked}
          onChange={handleClick}
        />
      </div>
    </div>
  );
};
