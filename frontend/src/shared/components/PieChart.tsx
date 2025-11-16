import { useState } from "react";

interface IPieChartData {
  label: string;
  value: number;
  color?: string;
}

interface IPieChartProps {
  data: IPieChartData[];
  title?: string;
  size?: number;
  showLegend?: boolean;
  showPercentage?: boolean;
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
];

export default function PieChart({
  data,
  title,
  size = 200,
  showLegend = true,
  showPercentage = true,
  colors = DEFAULT_COLORS,
}: IPieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Nenhum dado disponível
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Build segments with a reducer so we don't reassign variables during render
  const { segments } = data.reduce(
    (acc, item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = acc.currentAngle;
      const endAngle = startAngle + angle;

      acc.segments.push({
        ...item,
        percentage,
        startAngle,
        endAngle,
        color: item.color || colors[index % colors.length],
      });

      acc.currentAngle = endAngle;
      return acc;
    },
    {
      segments: [] as Array<
        IPieChartData & {
          percentage: number;
          startAngle: number;
          endAngle: number;
          color: string;
        }
      >,
      currentAngle: -90,
    }
  );

  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(0, 0, radius, endAngle);
    const end = polarToCartesian(0, 0, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      0,
      0,
      "Z",
    ].join(" ");
  };

  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  const radius = size / 2 - 10;

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}

      <div
        className={`flex ${showLegend ? "flex-col lg:flex-row" : "justify-center"} items-center gap-8`}
      >
        {/* Pie Chart */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
            className="transform"
          >
            {segments.map((segment, index) => (
              <g key={index}>
                <path
                  d={createArc(segment.startAngle, segment.endAngle, radius)}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    opacity:
                      hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                    transform:
                      hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "center",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <title>{`${segment.label}: ${segment.value.toLocaleString()} (${segment.percentage.toFixed(1)}%)`}</title>
                </path>
              </g>
            ))}
          </svg>

          {/* Center Circle (Donut style) */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full flex items-center justify-center"
            style={{ width: size * 0.5, height: size * 0.5 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {total.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex-1 space-y-2">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  backgroundColor:
                    hoveredIndex === index ? "#f9fafb" : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {segment.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {segment.value.toLocaleString()}
                  </div>
                  {showPercentage && (
                    <div className="text-xs text-gray-600">
                      {segment.percentage.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// EXEMPLO DE USO:
/*
const categoryData = [
  { label: "Eletrônicos", value: 45000, color: "#10b981" },
  { label: "Roupas", value: 30000, color: "#3b82f6" },
  { label: "Alimentos", value: 25000, color: "#f59e0b" },
  { label: "Móveis", value: 15000, color: "#ef4444" }
];

<PieChart
  data={categoryData}
  title="Vendas por Categoria"
  size={250}
  showLegend={true}
  showPercentage={true}
/>
*/
