"use client";

import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, RotateCcw, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

interface ImageUploadProps {
  onImageChange?: (file: File | null) => void;
  label?: string;
  placeholder?: string;
  maxSize?: number; // MB
  className?: string;
}

export function ImageUpload({
  onImageChange,
  label = "画像",
  placeholder = "画像をアップロード",
  maxSize = 5,
  className = "",
}: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageChange = useCallback(
    (file: File | null) => {
      if (file) {
        if (file.size > maxSize * 1024 * 1024) {
          alert(`ファイルサイズは${maxSize}MB以下にしてください`);
          return;
        }

        if (!file.type.startsWith("image/")) {
          alert("画像ファイルを選択してください");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }

      onImageChange?.(file);
    },
    [maxSize, onImageChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleImageChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleImageChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = () => {
    setImagePreview(null);
    onImageChange?.(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>

      <div className="relative">
        <Card
          className={`
            border-2 border-dashed transition-all duration-200 ease-in-out overflow-hidden
            ${
              isDragOver
                ? "border-primary bg-primary/5 shadow-md"
                : imagePreview
                  ? "border-border bg-background"
                  : "border-muted-foreground/25 hover:border-muted-foreground/40 bg-muted/20"
            }
          `}
        >
          <CardContent className="p-0">
            {imagePreview ? (
              <div className="space-y-0">
                {/* 画像表示エリア */}
                <div className="w-full h-64 bg-muted/20 flex items-center justify-center relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="プレビュー"
                    className="max-w-full max-h-full object-contain"
                  />

                  {/* 削除ボタン - 右上に常時表示 */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="
                      absolute top-3 right-3 
                      w-8 h-8 rounded-full 
                      bg-black/70 hover:bg-black/90 
                      shadow-lg hover:shadow-xl
                      flex items-center justify-center
                      transition-all duration-200
                      z-10 pointer-events-auto
                    "
                    aria-label="画像を削除"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* アクションボタンエリア - 画像外に配置 */}
                <div className="p-3 bg-background border-t flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">画像がアップロードされました</div>
                  <div className="flex gap-2">
                    <label
                      htmlFor="image-change-v3"
                      className="
                        inline-flex items-center gap-2 px-3 py-1.5 
                        bg-black/70 hover:bg-black/90 
                        text-white text-sm rounded-md
                        cursor-pointer transition-colors
                      "
                    >
                      <RotateCcw className="w-4 h-4" />
                      変更
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-change-v3"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="
                  p-8 text-center cursor-pointer
                  transition-colors duration-200
                  h-64 flex items-center justify-center
                "
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <label htmlFor="image-upload-v3" className="w-full h-full cursor-pointer">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      {isDragOver ? (
                        <Upload className="w-8 h-8 text-primary animate-bounce" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium text-foreground">
                        {isDragOver ? "ここにドロップしてください" : placeholder}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ドラッグ&ドロップまたはクリックして選択
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF (最大 {maxSize}MB)
                      </p>
                    </div>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload-v3"
                    />
                  </div>
                </label>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
