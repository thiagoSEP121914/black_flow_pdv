import { useMemo } from "react";

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

// Helper to calculate control points for smooth Bézier curves
const getControlPoint = (
  current: { x: number; y: number },
  previous: { x: number; y: number },
  next: { x: number; y: number },
  reverse?: boolean
) => {
  const p = previous || current;
  const n = next || current;
  const smoothing = 0.2; // 0 to 1

  const o = {
    x: n.x - p.x,
    y: n.y - p.y,
  };

  const angle = Math.atan2(o.y, o.x) + (reverse ? Math.PI : 0);
  const length =
    Math.sqrt(Math.pow(n.x - p.x, 2) + Math.pow(n.y - p.y, 2)) * smoothing;

  const x = current.x + Math.cos(angle) * length;
  const y = current.y + Math.sin(angle) * length;

  return { x, y };
};

const createBezierCommand = (
  point: { x: number; y: number },
  i: number,
  a: { x: number; y: number }[]
) => {
  const { x: cpsX, y: cpsY } = getControlPoint(a[i - 1], a[i - 2], point);
  const { x: cpeX, y: cpeY } = getControlPoint(point, a[i - 1], a[i + 1], true);

  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
};

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

  const { points, yAxisLabels } = useMemo(() => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    // Add some padding to the top range so the line doesn't hit the very top
    const paddedMax = maxValue + range * 0.1;

    const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
      // Use paddedMax for calculating labels if you want them well distributed,
      // or just standard distribution based on data.
      // Let's stick to a simple distribution covering the range.
      const value = minValue + (range / 4) * i;
      return Math.round(value);
    }).reverse();

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1 || 1)) * 100;
      // To ensure it fits nicely, use paddedMax for Y calculation if desired,
      // but let's stick to the visible range logic.
      const percentage = ((item.value - minValue) / range) * 100;

      // We want some padding top/bottom in the chart area usually,
      // but strict math: y=100 is bottom (min), y=0 is top (max).
      // Let's constrain it slightly to avoid clipping strokeWidth.
      const y = 100 - percentage;
      return { x, y, value: item.value, label: item.label };
    });

    return { points, yAxisLabels };
  }, [data]);

  const pathD = useMemo(() => {
    return points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      return `${acc} ${createBezierCommand(point, i, a)}`;
    }, "");
  }, [points]);

  const fillPathD = `${pathD} L 100 100 L 0 100 Z`;

  // Gradient ID
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      <div className="flex gap-4">
        {/* Y-Axis Labels */}
        <div
          className="flex flex-col justify-between text-xs text-gray-400 py-2 font-medium"
          style={{ height: `${height}px` }}
        >
          {yAxisLabels.map((label, index) => (
            <div key={index} className="text-right pr-2 whitespace-nowrap">
              {valuePrefix}
              {label.toLocaleString()}
              {valueSuffix}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 relative">
          <svg
            className="w-full overflow-visible"
            style={{ height: `${height}px` }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
              </linearGradient>
            </defs>

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
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                );
              })}

            {/* Fill area */}
            <path
              d={fillPathD}
              fill={`url(#${gradientId})`}
              stroke="none"
            />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Optional: Points on hover provided via CSS or just subtle dots if requested. 
                Prototype usually has no dots or very subtle ones. 
                Leaving dots out for 'clean' look or making them tiny.
            */}
          </svg>

          {/* X-Axis Labels */}
          <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
            {data.map((item, index) => (
              <div key={index} className="text-center relative">
                <span className="block transform -translate-x-1/2 left-1/2 absolute top-0 w-20">
                  {item.label}
                </span>
                {/* Spacer to give height */}
                <span className="invisible">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
