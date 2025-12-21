interface ILineChartData {
  label: string;
  value: number;
}

interface ILineChartProps {
  data: ILineChartData[];
  height?: number;
  lineColor?: string;
  showGrid?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function LineChart({
  data,
  height = 250,
  lineColor = "#10b981",
  showGrid = true,
  valuePrefix = "",
  valueSuffix = "",
}: ILineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Nenhum dado disponível
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
    const value = minValue + (range / 4) * i;
    return Math.round(value);
  }).reverse();

  // Calculate points for SVG path
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const percentage = ((item.value - minValue) / range) * 100;
    const y = 100 - percentage;
    return { x, y, value: item.value, label: item.label };
  });

  const pathD = points
    .map((point, index) => {
      const xPercent = point.x;
      const yPercent = point.y;
      return `${index === 0 ? "M" : "L"} ${xPercent} ${yPercent}`;
    })
    .join(" ");

  const fillPathD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="w-full">
      <div className="flex gap-4">
        {/* Y-Axis Labels */}
        <div
          className="flex flex-col justify-between text-xs text-gray-500 py-2"
          style={{ height: `${height}px` }}
        >
          {yAxisLabels.map((label, index) => (
            <div key={index} className="text-right pr-2">
              {valuePrefix}
              {label.toLocaleString()}
              {valueSuffix}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1">
          <svg
            className="w-full"
            style={{ height: `${height}px` }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Grid */}
            {showGrid &&
              yAxisLabels.map((_, index) => {
                const y = (index / (yAxisLabels.length - 1)) * 100;
                return (
                  <line
                    key={`grid-${index}`}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="#f0f0f0"
                    strokeWidth="0.5"
                  />
                );
              })}

            {/* Fill area */}
            <path
              d={fillPathD}
              fill={lineColor}
              fillOpacity="0.1"
              stroke="none"
            />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Points */}
            {points.map((point, index) => (
              <circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r="1.5"
                fill={lineColor}
              />
            ))}
          </svg>

          {/* X-Axis Labels */}
          <div className="flex justify-between text-xs text-gray-600 px-2 pt-2">
            {data.map((item, index) => (
              <div key={index} className="text-center">
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
