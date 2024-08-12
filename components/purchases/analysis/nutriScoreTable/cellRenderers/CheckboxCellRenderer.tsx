import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { type FunctionComponent } from "react";

export const CheckboxCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ data }) => {
  const emailName = data.category.at(-1);

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center">
        <input type="checkbox" className="h-4 w-4 p-[1px]" />
        {emailName}
      </div>
    </div>
  );
};
