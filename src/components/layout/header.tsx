type HeaderProps = {
  userName?: string;
};

export function Header({ userName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#EC6D80] text-white shadow-md">
      <div className="flex items-center justify-between max-w-lg mx-auto px-4 py-3 min-h-[56px]">
        <h1 className="text-xl font-bold tracking-wide m-0">
          なでしこつながり
        </h1>
        {userName && (
          <span className="text-sm opacity-90 shrink-0 ml-3">{userName}</span>
        )}
      </div>
    </header>
  );
}
