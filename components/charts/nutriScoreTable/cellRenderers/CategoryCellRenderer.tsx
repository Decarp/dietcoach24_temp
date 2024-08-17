import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { type FunctionComponent } from "react";

export const CategoryCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value, data: { category, image } }) => {
  const isMajorCategory = category.length === 1;
  const categoryText = isMajorCategory ? category[0] : category[1];

  return (
    <div className="flex flex-row-reverse items-center justify-start gap-2">
      <div className="flex flex-col">
        <span
          className={`${
            isMajorCategory
              ? "text-lg text-gray-700 font-semibold"
              : "text-sm text-gray-500"
          } whitespace-normal text-wrap max-w-[150px] break-words`}
        >
          {categoryText}
        </span>
      </div>
      {/* Uncomment the following img tag if you need to include the image */}
      {/* <img
        className="w-9 h-9 mr-1 rounded-full p-0.5"
        src={`/example/hr/${image}.png`}
        alt={value.toLowerCase()}
      /> */}
    </div>
  );
};
