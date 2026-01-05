"use client"

import { useCustomerView } from "@/hooks/views/useCustomerView"
import { CustomerDialog } from "./_components/customer-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Ban, CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export default function CustomersPage() {
  const {
    customers,
    isLoading,
    searchTerm,
    setSearchTerm,
    isSheetOpen,
    editingCustomer,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseSheet,
    handleSave,
    handleToggleStatus
  } = useCustomerView()

  const t = useTranslations("Customers")

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("title", { defaultMessage: "Customers" })}</h2>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {t("add", { defaultMessage: "Add Customer" })}
        </Button>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder", { defaultMessage: "Search customers..." })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name", { defaultMessage: "Name" })}</TableHead>
              <TableHead>{t("email", { defaultMessage: "Email" })}</TableHead>
              <TableHead>{t("phone", { defaultMessage: "Phone" })}</TableHead>
              <TableHead>{t("status", { defaultMessage: "Status" })}</TableHead>
              <TableHead className="text-right">{t("actions", { defaultMessage: "Actions" })}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("loading", { defaultMessage: "Loading..." })}
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noResults", { defaultMessage: "No customers found." })}
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {customer.isActive ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {t("active", { defaultMessage: "Active" })}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                        {t("inactive", { defaultMessage: "Inactive" })}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(customer)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(customer)}>
                        {customer.isActive ? <Ban className="h-4 w-4 text-orange-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CustomerDialog
        open={isSheetOpen}
        onOpenChange={handleCloseSheet}
        initialData={editingCustomer}
        onSave={handleSave}
      />
    </div>
  )
}
