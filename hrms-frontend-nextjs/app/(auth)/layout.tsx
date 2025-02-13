export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        // {/* Container with dark background layout */}
        <div className="flex items-center justify-center h-dvh w-full bg-[#535353]">
          {/* Auth Content (Login, Register/Reset Pages) with dark gray background */}
          <div className="bg-[#d9d9d9] w-[90%] h-[85%] ">{children}</div>
        </div>
  );
}
