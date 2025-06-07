"use client";

import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface MultiImageUploadProps {
  onImagesChange?: (files: File[]) => void;
  label?: string;
  placeholder?: string;
  maxSize?: number; // MB
  maxImages?: number; // 最大画像数
  multiple?: boolean; // 複数選択を許可するか
  className?: string;
}

export function MultiImageUpload({
  onImagesChange,
  label = "画像",
  placeholder = "画像をアップロード",
  maxSize = 5,
  maxImages = 5,
  multiple = true,
  className = "",
}: MultiImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      const validFiles: ImageFile[] = [];
      let completedCount = 0;
      const targetCount = Math.min(files.length, maxImages - images.length);

      if (targetCount === 0) return;

      for (const file of files) {
        // ファイルサイズチェック
        if (file.size > maxSize * 1024 * 1024) {
          alert(`${file.name}: ファイルサイズは${maxSize}MB以下にしてください`);
          continue;
        }

        // 画像ファイルかチェック
        if (!file.type.startsWith("image/")) {
          alert(`${file.name}: 画像ファイルを選択してください`);
          continue;
        }

        // 最大枚数チェック
        if (images.length + validFiles.length >= maxImages) {
          alert(`最大${maxImages}枚まで選択できます`);
          break;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageFile: ImageFile = {
            id: generateId(),
            file,
            preview: e.target?.result as string,
          };
          validFiles.push(imageFile);
          completedCount++;

          // 全ての画像の読み込みが完了したら状態を更新（非同期で実行）
          if (completedCount === targetCount) {
            // 次のイベントループで実行して、レンダリング中の状態更新を避ける
            setTimeout(() => {
              setImages((prev) => {
                const newImages = multiple ? [...prev, ...validFiles] : validFiles;
                // 状態更新後にコールバックを実行
                setTimeout(() => {
                  onImagesChange?.(newImages.map((img) => img.file));
                }, 0);
                return newImages;
              });
            }, 0);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [images.length, maxImages, maxSize, multiple, onImagesChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // input をリセット（同じファイルを再選択可能にする）
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const newImages = prev.filter((img) => img.id !== id);
      // 次のイベントループで実行して、レンダリング中の状態更新を避ける
      setTimeout(() => {
        onImagesChange?.(newImages.map((img) => img.file));
      }, 0);
      return newImages;
    });
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium text-foreground flex items-center justify-between">
        <span>{label}</span>
        {multiple && (
          <span className="text-xs text-muted-foreground">
            {images.length} / {maxImages}
          </span>
        )}
      </Label>

      {/* 既存の画像表示 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={image.id} className="relative group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={image.preview}
                    alt={`プレビュー ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* 削除ボタン */}
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="
                      absolute top-2 right-2 
                      w-6 h-6 rounded-full 
                      bg-black/70 hover:bg-black/90 
                      shadow-lg hover:shadow-xl
                      flex items-center justify-center
                      transition-all duration-200
                      opacity-0 group-hover:opacity-100
                    "
                    aria-label="画像を削除"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* アップロードエリア */}
      {canAddMore && (
        <Card
          className={`
            border-2 border-dashed transition-all duration-200 ease-in-out overflow-hidden
            ${
              isDragOver
                ? "border-primary bg-primary/5 shadow-md"
                : "border-muted-foreground/25 hover:border-muted-foreground/40 bg-muted/20"
            }
          `}
        >
          <CardContent className="p-0">
            <div
              className="
                p-8 cursor-pointer
                transition-colors duration-200
                h-32 flex items-center justify-center
              "
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center justify-center"
              >
                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {isDragOver ? (
                      <Upload className="w-6 h-6 text-primary animate-bounce" />
                    ) : images.length > 0 ? (
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {isDragOver
                        ? "ここにドロップしてください"
                        : images.length > 0
                          ? "画像を追加"
                          : placeholder}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {multiple ? `最大${maxImages}枚まで` : "1枚まで"} (最大 {maxSize}MB)
                    </p>
                  </div>
                </div>

                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple={multiple}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
              </label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
