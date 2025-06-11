"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Work } from "@/types/database";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import type React from "react";
import { useState } from "react";

interface MultiWorkSelectorProps {
  works: Work[];
}

export const MultiWorkSelector: React.FC<MultiWorkSelectorProps> = (props) => {
  const [open, setOpen] = useState(false);

  // クエリパラメータで選択された作品IDを管理
  const [selectedWorkIds, setSelectedWorkIds] = useQueryState(
    "works",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [selectedWorkTypes, setSelectedWorkTypes] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const displayWorks =
    selectedWorkTypes.length > 0
      ? props.works.filter((work) => selectedWorkTypes.includes(work.type))
      : props.works;

  // 選択された作品の情報を取得（propsからの作品データまたはダミーデータから）
  const worksData = props.works;
  const selectedWorksData = worksData.filter((work) =>
    selectedWorkIds.includes(work.id.toString())
  );

  // 作品の選択/選択解除を処理
  const handleWorkToggle = (workId: string) => {
    const newSelectedWorks = selectedWorkIds.includes(workId)
      ? selectedWorkIds.filter((id: string) => id !== workId)
      : [...selectedWorkIds, workId];

    setSelectedWorkIds(newSelectedWorks);
  };

  // 作品を個別に削除
  const handleWorkRemove = (workId: string) => {
    const newSelectedWorks = selectedWorkIds.filter((id: string) => id !== workId);
    setSelectedWorkIds(newSelectedWorks);
  };

  // 全ての選択を解除
  const handleClearAll = () => {
    setSelectedWorkIds([]);
  };

  return (
    <div className="w-full space-y-2">
      <div className="space-y-1">
        <span className="font-bold text-sm">作品で絞り込む</span>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal"
          >
            {selectedWorkIds.length === 0 ? (
              <span className="text-muted-foreground">作品を選択...</span>
            ) : (
              <span>
                {selectedWorkIds.length === 1
                  ? selectedWorksData[0]?.title
                  : `${selectedWorkIds.length}件の作品を選択中`}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="作品を検索..." />
            <CommandList>
              <CommandEmpty>作品が見つかりませんでした。</CommandEmpty>
              <CommandGroup>
                {displayWorks.map((work) => (
                  <CommandItem
                    key={work.id}
                    value={work.title}
                    onSelect={() => handleWorkToggle(work.id.toString())}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedWorkIds.includes(work.id.toString()) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{work.title}</span>
                      <span className="text-muted-foreground text-xs">アニメ</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* 選択された作品のバッジ表示 */}
      {selectedWorkIds.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 text-sm">
              選択中の作品 ({selectedWorkIds.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-auto p-1 text-gray-500 text-xs hover:text-gray-700"
            >
              すべて解除
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedWorksData.map((work) => (
              <Badge key={work.id} variant="secondary" className="flex items-center gap-1 pr-1">
                <span className="text-xs">{work.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleWorkRemove(work.id.toString())}
                  className="h-auto p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
