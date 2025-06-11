"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WORK_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import type React from "react";

export const WorkTypeSelector: React.FC = () => {
  // クエリパラメータで選択された作品タイプを管理
  const [selectedTypes, setSelectedTypes] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // 作品タイプの選択/選択解除を処理
  const handleTypeToggle = (typeValue: string) => {
    const newSelectedTypes = selectedTypes.includes(typeValue)
      ? selectedTypes.filter((type: string) => type !== typeValue)
      : [...selectedTypes, typeValue];

    setSelectedTypes(newSelectedTypes);
  };

  // 作品タイプを個別に削除
  const handleTypeRemove = (typeValue: string) => {
    const newSelectedTypes = selectedTypes.filter((type: string) => type !== typeValue);
    setSelectedTypes(newSelectedTypes);
  };

  // 全ての選択を解除
  const handleClearAll = () => {
    setSelectedTypes([]);
  };

  // 選択された作品タイプのラベル情報を取得
  const selectedTypesData = WORK_TYPE.filter((workType) => selectedTypes.includes(workType.value));

  return (
    <div className="space-y-3 w-full">
      <div className="space-y-1">
        <span className="text-sm font-bold">作品タイプで絞り込む</span>
      </div>

      {/* Toggle Group - 縦2横4のレイアウト */}
      <div className="grid grid-cols-4 gap-2">
        {WORK_TYPE.map((workType) => (
          <Button
            key={workType.value}
            variant={selectedTypes.includes(workType.value) ? "default" : "outline"}
            size="sm"
            onClick={() => handleTypeToggle(workType.value)}
            className={cn(
              "h-auto py-2 px-3 text-xs transition-all",
              selectedTypes.includes(workType.value)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {workType.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
