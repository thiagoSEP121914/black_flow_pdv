interface ICardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function Card({
  title,
  children,
  actions,
  className = "",
  icon,
}: ICardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow ${className} cursor-pointer`}
    >
      {(title || actions || icon) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
