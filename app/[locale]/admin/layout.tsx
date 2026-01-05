import { Sidebar } from "@/components/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        {/* The margin-left 64 matches the w-64 of the sidebar */}
        {children}
      </div>
    </div>
  )
}
