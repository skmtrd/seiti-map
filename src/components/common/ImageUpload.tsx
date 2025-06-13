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
  maxSize?: number;
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
      <Label className="font-medium text-foreground text-sm">{label}</Label>

      <div className="relative">
        <Card
          className={`overflow-hidden border-2 border-dashed transition-all duration-200 ease-in-out ${
            isDragOver
              ? "border-primary bg-primary/5 shadow-md"
              : imagePreview
                ? "border-border bg-background"
                : "border-muted-foreground/25 bg-muted/20 hover:border-muted-foreground/40"
          }
          `}
        >
          <CardContent className="p-0">
            {imagePreview ? (
              <div className="space-y-0">
                {/* 画像表示エリア */}
                <div className="relative flex h-64 w-full items-center justify-center bg-muted/20">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="プレビュー"
                    className="max-h-full max-w-full object-contain"
                  />

                  {/* 削除ボタン - 右上に常時表示 */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="pointer-events-auto absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 shadow-lg transition-all duration-200 hover:bg-black/90 hover:shadow-xl "
                    aria-label="画像を削除"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>

                {/* アクションボタンエリア - 画像外に配置 */}
                <div className="flex items-center justify-between border-t bg-background p-3">
                  <div className="text-muted-foreground text-sm">画像がアップロードされました</div>
                  <div className="flex gap-2">
                    <label
                      htmlFor="image-change-v3"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-black/70 px-3 py-1.5 text-sm text-white transition-colors hover:bg-black/90 "
                    >
                      <RotateCcw className="h-4 w-4" />
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
                className="flex h-64 cursor-pointer items-center justify-center p-8 text-center transition-colors duration-200 "
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <label htmlFor="image-upload-v3" className="h-full w-full cursor-pointer">
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      {isDragOver ? (
                        <Upload className="h-8 w-8 animate-bounce text-primary" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium text-foreground">
                        {isDragOver ? "ここにドロップしてください" : placeholder}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        ドラッグ&ドロップまたはクリックして選択
                      </p>
                      <p className="text-muted-foreground text-xs">
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
