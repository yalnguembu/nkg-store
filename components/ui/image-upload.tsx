"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { config } from "@/lib/config"

interface ImageUploadProps {
  label: string
  currentImageUrl?: string
  onImageChange: (url: string) => void
  entityType: 'categories' | 'brands' | 'models' | 'products' | 'services'
  accept?: string
}

export function ImageUpload({
  label,
  currentImageUrl,
  onImageChange,
  entityType,
  accept = "image/*"
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "")
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${config.apiUrl}/files/upload/${entityType}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      // Handle both direct response and nested data response
      const fileData = result.data || result
      const imageUrl = fileData.url.startsWith('http')
        ? fileData.url
        : `${config.apiUrl}${fileData.url}`

      setPreviewUrl(imageUrl)
      onImageChange(imageUrl)

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl("")
    onImageChange("")
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {previewUrl ? (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      <div className="flex gap-2">
        <Input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id={`file-upload-${entityType}`}
        />
        <Label htmlFor={`file-upload-${entityType}`} className="cursor-pointer">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            asChild
          >
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Image"}
            </span>
          </Button>
        </Label>
      </div>
    </div>
  )
}
