export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="flex flex-col ">{children}</section>;
}
