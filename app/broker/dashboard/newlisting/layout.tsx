export default function NewListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-16 mt-16">
      {children}
    </div>
  );
}
