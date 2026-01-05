"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderOpen,
  Building2,
  Package,
  Boxes,
  Users,
  ShoppingCart,
  FileCheck,
  Truck,
  FileText,
  LogOut,
  ChevronRight,
  ChevronDown,
  Box,
  CreditCard
} from "lucide-react"
import { useAuthView } from "@/hooks/views/useAuthView"
import { useTranslations } from "next-intl"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  items?: { label: string; href: string; icon?: React.ReactNode }[]
}

export function Sidebar() {
  const pathname = usePathname()
  const { handleLogout } = useAuthView()
  const t = useTranslations('sidebar')

  // Maintain state for open collapsibles
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    catalogue: true,
    crm: true,
    sales: true
  })

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  const navItems: NavItem[] = [
    {
      label: t("dashboard"),
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      label: t("catalogue"),
      href: "/admin/catalogue",
      icon: <FolderOpen className="w-5 h-5" />,
      items: [
        { label: t("products"), href: "/admin/catalogue/products", icon: <Package className="w-4 h-4" /> },
        { label: t("categories"), href: "/admin/catalogue/categories", icon: <FolderOpen className="w-4 h-4" /> },
        { label: t("brands"), href: "/admin/catalogue/brands", icon: <Building2 className="w-4 h-4" /> },
        { label: t("models"), href: "/admin/catalogue/models", icon: <Box className="w-4 h-4" /> },
        { label: t("suppliers"), href: "/admin/catalogue/suppliers", icon: <Truck className="w-4 h-4" /> },
      ]
    },
    {
      label: t("stock"),
      href: "/admin/catalogue/stock",
      icon: <Boxes className="w-5 h-5" />
    },
    {
      label: t("crm"),
      href: "/admin/crm",
      icon: <Users className="w-5 h-5" />,
      items: [
        { label: t("customers"), href: "/admin/customers", icon: <Users className="w-4 h-4" /> },
      ]
    },
    {
      label: t("sales"),
      href: "/admin/sales",
      icon: <CreditCard className="w-5 h-5" />,
      items: [
        { label: t("orders"), href: "/admin/orders", icon: <ShoppingCart className="w-4 h-4" /> },
        { label: t("quotes"), href: "/admin/quotes", icon: <FileCheck className="w-4 h-4" /> },
      ]
    },
    { label: t("documents"), href: "/admin/documents", icon: <FileText className="w-5 h-5" /> },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800 overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">E</div>
          <div>
            <h1 className="text-xl font-bold">Elektrik</h1>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-700">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const hasSubItems = item.items && item.items.length > 0
            const key = item.label.toLowerCase() // Simple fix for key, ideally use a stable ID but label works for now
            const isActive = pathname === item.href
            const isGroupOpen = openGroups[key]

            if (hasSubItems) {
              // Check if any child is active to highlight group or keep it open if logic demanded (currently manually toggled)
              const isChildActive = item.items?.some(sub => pathname === sub.href || pathname.startsWith(sub.href))

              return (
                <li key={item.label}>
                  <Collapsible
                    open={isGroupOpen}
                    onOpenChange={() => toggleGroup(key)}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <button className={cn(
                        "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all text-slate-400 hover:bg-slate-800 hover:text-white",
                        isChildActive && "text-white bg-slate-800/50"
                      )}>
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        {isGroupOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-1 pt-1 pb-1">
                      {item.items?.map(subItem => {
                        const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href)
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm",
                              isSubActive ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                          >
                            {subItem.icon}
                            <span>{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              )
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">{t('logout')}</span>
        </button>
      </div>
    </aside>
  )
}
