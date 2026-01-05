"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { Star, Trash2 } from "lucide-react"
import type { ProductImage } from "@/hooks/forms/useProductForm"
import { useState } from "react"

interface ImagesStepProps {
  images: ProductImage[]
  onAddImage: (image: ProductImage) => void
  onRemoveImage: (index: number) => void
  onSetPrimary: (index: number) => void
}

export function ImagesStep({
  images,
  onAddImage,
  onRemoveImage,
  onSetPrimary
}: ImagesStepProps) {
  const [uploadingUrl, setUploadingUrl] = useState('')

  const handleImageUpload = (url: string) => {
    if (url) {
      onAddImage({
        url,
        alt: '',
        isPrimary: images.length === 0, // First image is primary by default
        orderIndex: images.length
      })
      setUploadingUrl('')
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Product Images</h3>

      <div className="space-y-4">
        <ImageUpload
          label="Upload Product Image"
          currentImageUrl={uploadingUrl}
          onImageChange={handleImageUpload}
          entityType="products"
        />

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={image.alt || `Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant={image.isPrimary ? "default" : "secondary"}
                      onClick={() => onSetPrimary(index)}
                      title="Set as primary"
                    >
                      <Star className={`h-4 w-4 ${image.isPrimary ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => onRemoveImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                      Primary
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No images uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">Upload at least one product image</p>
          </div>
        )}
      </div>
    </div>
  )
}
