import type React from "react"
import { ClientLayout } from "@/components/client/client-layout"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
