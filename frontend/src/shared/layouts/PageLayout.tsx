interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="h-full w-full  p-6 overflow-hidden">
      <div className="h-full w-full rounded-xl bg-white shadow-sm p-6 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
};
