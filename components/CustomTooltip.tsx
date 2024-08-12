interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const name = payload[0]?.payload?.name;

    return (
      <div className="custom-tooltip bg-white px-4 py-2 border rounded-md">
        <p className="label">{name || "No Name Available"}</p>
      </div>
    );
  }

  return null;
};
