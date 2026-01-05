"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, FileText } from "lucide-react"
import type { ProductDocument } from "@/hooks/forms/useProductForm"
import { useState } from "react"
import { config } from "@/lib/config"

interface DocumentsStepProps {
  documents: ProductDocument[]
  onAddDocument: (doc: ProductDocument) => void
  onRemoveDocument: (index: number) => void
}

export function DocumentsStep({
  documents,
  onAddDocument,
  onRemoveDocument
}: DocumentsStepProps) {
  const [newDoc, setNewDoc] = useState<ProductDocument>({
    title: '',
    url: '',
    type: 'OTHER'
  })
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${config.apiUrl}/files/upload/products`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      const fileData = result.data || result
      const fileUrl = fileData.url.startsWith('http')
        ? fileData.url
        : `${config.apiUrl}${fileData.url}`

      setNewDoc(prev => ({ ...prev, url: fileUrl }))
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleAddDocument = () => {
    if (newDoc.title && newDoc.url) {
      onAddDocument(newDoc)
      setNewDoc({ title: '', url: '', type: 'OTHER' })
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Product Documents</h3>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Document Title</Label>
              <Input
                value={newDoc.title}
                onChange={(e) => setNewDoc(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., User Manual"
              />
            </div>

            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select
                value={newDoc.type}
                onValueChange={(val: any) => setNewDoc(prev => ({ ...prev, type: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                  <SelectItem value="SPEC">Specification</SelectItem>
                  <SelectItem value="WARRANTY">Warranty</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Document</Label>
            <Input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              accept=".pdf,.doc,.docx"
            />
            {newDoc.url && (
              <p className="text-sm text-green-600">✓ File uploaded successfully</p>
            )}
          </div>

          <Button
            type="button"
            onClick={handleAddDocument}
            disabled={!newDoc.title || !newDoc.url}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </CardContent>
      </Card>

      {documents.length > 0 && (
        <div className="space-y-2">
          <Label>Uploaded Documents</Label>
          {documents.map((doc, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">{doc.type}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveDocument(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {documents.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No documents uploaded yet</p>
        </div>
      )}
    </div>
  )
}
