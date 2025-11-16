interface IBarChartData {
  label: string;
  value: number;
  color?: string;
}

interface IBarChartProps {
  data: IBarChartData[];
  title?: string;
  height?: number;
  showValues?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  barColor?: string;
  labelRotate?: boolean;
}

export default function BarChart({
  data,
  title,
  height = 300,
  showValues = false,
  valuePrefix = "",
  valueSuffix = "",
  barColor = "#10b981",
  labelRotate = false,
}: IBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Nenhum dado disponível
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue;
  const step = range / 5;

  const yAxisLabels = Array.from({ length: 6 }, (_, i) => {
    const value = minValue + step * i;
    return Math.round(value);
  }).reverse();

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}

      <div className="flex gap-4">
        {/* Y-Axis Labels */}
        <div
          className="flex flex-col justify-between text-xs text-gray-600 py-2"
          style={{ height: `${height}px` }}
        >
          {yAxisLabels.map((label, index) => (
            <div key={index} className="text-right">
              {valuePrefix}
              {label.toLocaleString()}
              {valueSuffix}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1">
          <div
            className="flex items-end justify-between gap-1 border-l-2 border-b-2 border-gray-300 px-2 pb-8"
            style={{ height: `${height}px` }}
          >
            {data.map((item, index) => {
              const percentage = ((item.value - minValue) / range) * 100;
              const itemColor = item.color || barColor;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  {/* Bar */}
                  <div className="relative w-full flex flex-col items-center">
                    {showValues && (
                      <div className="text-xs font-semibold text-gray-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {valuePrefix}
                        {item.value.toLocaleString()}
                        {valueSuffix}
                      </div>
                    )}
                    <div
                      className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                      style={{
                        height: `${percentage}%`,
                        backgroundColor: itemColor,
                        minHeight: "4px",
                      }}
                      title={`${item.label}: ${valuePrefix}${item.value.toLocaleString()}${valueSuffix}`}
                    />
                  </div>

                  {/* Label */}
                  <div
                    className={`text-xs text-gray-600 font-medium text-center ${
                      labelRotate ? "-rotate-45 origin-top-left mt-4" : ""
                    }`}
                  >
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// EXEMPLO DE USO:
/*
const salesData = [
  { label: "Jan", value: 50000 },
  { label: "Fev", value: 55000 },
  { label: "Mar", value: 48000 },
  { label: "Abr", value: 47000 },
  { label: "Mai", value: 58000 },
  { label: "Jun", value: 78000 },
  { label: "Jul", value: 60000 },
  { label: "Ago", value: 65000 },
  { label: "Set", value: 70000 },
  { label: "Out", value: 55000 },
  { label: "Nov", value: 52000 },
  { label: "Dez", value: 48000 }
];

<BarChart
  data={salesData}
  title="Vendas Mensais"
  valuePrefix="R$ "
  showValues={true}
  barColor="#10b981"
/>
*/
