"use client";

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
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

// ダミーデータ
const animeWorks = [
  { id: 1, title: "君の名は。", type: "anime" },
  { id: 2, title: "天気の子", type: "anime" },
  { id: 3, title: "すずめの戸締まり", type: "anime" },
  { id: 4, title: "千と千尋の神隠し", type: "anime" },
  { id: 5, title: "となりのトトロ", type: "anime" },
  { id: 6, title: "魔女の宅急便", type: "anime" },
  { id: 7, title: "ハウルの動く城", type: "anime" },
  { id: 8, title: "もののけ姫", type: "anime" },
  { id: 9, title: "風の谷のナウシカ", type: "anime" },
  { id: 10, title: "崖の上のポニョ", type: "anime" },
  { id: 11, title: "攻殻機動隊", type: "anime" },
  { id: 12, title: "AKIRA", type: "anime" },
];

interface SingleWorkSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  works?: Work[];
  placeholder?: string;
  field: ControllerRenderProps<TFieldValues, TName>;
  disabled?: boolean;
}

export const SingleWorkSelector = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  works = [],
  placeholder = "作品を選択...",
  field,
  disabled = false,
}: SingleWorkSelectorProps<TFieldValues, TName>) => {
  const [open, setOpen] = useState(false);

  // 作品データを取得（propsからの作品データまたはダミーデータから）
  const worksData = works.length > 0 ? works : animeWorks;

  // 選択された作品の情報を取得
  const selectedWork =
    field.value === "new"
      ? { title: "新規作成", type: "anime" }
      : worksData.find((work) => work.id.toString() === field.value);

  // 作品の選択を処理
  const handleWorkSelect = (workId: string) => {
    // 同じ作品を選択した場合は選択解除
    if (field.value === workId) {
      field.onChange("");
    } else {
      field.onChange(workId);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal"
          disabled={disabled}
        >
          {!field.value ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <span>{selectedWork?.title}</span>
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
              <CommandItem value="new" onSelect={() => handleWorkSelect("new")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    field.value === "new" ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="font-medium">新規作成</span>
                  <span className="text-muted-foreground text-xs">新規作品を作成</span>
                </div>
              </CommandItem>
              {worksData.map((work) => (
                <CommandItem
                  key={work.id}
                  value={work.title}
                  onSelect={() => handleWorkSelect(work.id.toString())}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      field.value === work.id.toString() ? "opacity-100" : "opacity-0"
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
  );
};
