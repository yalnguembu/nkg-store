"use client"

import { useDocumentView } from "@/hooks/views/useDocumentView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Trash2, FileText, Eye } from "lucide-react"
import { useTranslations } from "next-intl"

export default function DocumentsPage() {
  const {
    documents,
    isLoading,
    searchTerm,
    setSearchTerm,
    handleDeleteDocument
  } = useDocumentView()

  const t = useTranslations("Documents")

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("title", { defaultMessage: "Documents" })}</h2>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder={t("searchPlaceholder", { defaultMessage: "Search documents..." })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fields.name", { defaultMessage: "Name" })}</TableHead>
              <TableHead>{t("fields.product", { defaultMessage: "Product" })}</TableHead>
              <TableHead>{t("fields.type", { defaultMessage: "Type" })}</TableHead>
              <TableHead className="text-right">{t("fields.created", { defaultMessage: "Created At" })}</TableHead>
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
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noResults", { defaultMessage: "No documents found." })}
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc: any) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    {doc.name}
                  </TableCell>
                  <TableCell>{doc.product?.name || "-"}</TableCell>
                  <TableCell>{doc.documentType}</TableCell>
                  <TableCell className="text-right">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => window.open(doc.documentUrl, '_blank')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
