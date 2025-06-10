"use client";

import { ImageUpload } from "@/components/common/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorks } from "@/hooks/SWR/getWorks";
import { useCreateSpotForm } from "@/hooks/form/useCreateSpotForm";
import { Link, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { SingleWorkSelector } from "../common/SingleWorkSelector";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function CreateSpotForm() {
  const { works, isLoading, isError, error, mutate } = useWorks();

  const { form, onSubmit, handleMapsUrlParse, handleImageSelect, states } = useCreateSpotForm();

  const getMapQuery = () => {
    const latitude = form.getValues("latitude");
    const longitude = form.getValues("longitude");

    if (latitude && longitude) {
      console.log(Number.parseFloat(latitude), Number.parseFloat(longitude));
      return `${Number.parseFloat(latitude).toFixed(6)},${Number.parseFloat(longitude).toFixed(6)}`;
    }
  };

  const shouldShowMap =
    states.showMap &&
    (form.getValues("address") || (form.getValues("latitude") && form.getValues("longitude")));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            スポット情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="workId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>作品を選択</FormLabel>
                    <FormControl>
                      <SingleWorkSelector
                        field={field}
                        works={works}
                        placeholder="作品を選択してください..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 新規作品作成フィールド */}
              {states.isNewWork && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-6">
                  <FormField
                    control={form.control}
                    name="newWorkTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>作品名</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="例: 君の名は。" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newWorkType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>作品の種類</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="種類を選択してください" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="anime">アニメ</SelectItem>
                              <SelectItem value="drama">ドラマ</SelectItem>
                              <SelectItem value="movie">映画</SelectItem>
                              <SelectItem value="game">ゲーム</SelectItem>
                              <SelectItem value="novel">小説</SelectItem>
                              <SelectItem value="manga">漫画</SelectItem>
                              <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newWorkDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>作品の説明（任意）</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} placeholder="作品についての簡単な説明" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>スポット名</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="例：神社の鳥居、学校の屋上、東京駅など" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>詳細説明</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="作品名、シーン、エピソードなどを詳しく教えてください"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Google Maps URL */}
              <div className="space-y-2">
                <Label htmlFor="mapsUrl" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Google Maps URL *
                  {states.isUrlParsing && (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      解析中...
                    </span>
                  )}
                </Label>
                <div className="flex gap-2">
                  {/* <Input
                    id="mapsUrl"
                    name="mapsUrl"
                    value={states.googleMapsUrl}
                    onChange={handleSetGoogleMapsUrl}
                    placeholder="短縮URL: https://maps.app.goo.gl/xxx または 長いURL: https://www.google.com/maps/place/xxx"
                    className="flex-1"
                    required
                  /> */}
                  <FormField
                    control={form.control}
                    name="mapsUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="短縮URL: https://maps.app.goo.gl/xxx または 長いURL: https://www.google.com/maps/place/xxx"
                            className="flex-1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    onClick={handleMapsUrlParse}
                    disabled={!form.watch("mapsUrl")?.trim() || states.isUrlParsing}
                    variant="outline"
                    className="shrink-0"
                  >
                    {states.isUrlParsing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Link className="mr-1 h-4 w-4" />
                        URL解析
                      </>
                    )}
                  </Button>
                </div>
                {states.urlParseStatus && (
                  <p className="text-blue-600 text-sm">{states.urlParseStatus}</p>
                )}
                {states.urlParseError && (
                  <p className="text-red-500 text-sm">{states.urlParseError}</p>
                )}
                <div className="space-y-1 text-muted-foreground text-sm">
                  <p>Google MapsのURLを入力してください</p>
                </div>
              </div>
              {/* 位置情報 */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        緯度
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="35.681236" readOnly className="bg-gray-50" />
                      </FormControl>
                      <FormDescription className="text-xs">URL解析で自動入力</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        経度
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="139.767125"
                          readOnly
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">URL解析で自動入力</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* 位置プレビュー */}
              {shouldShowMap && (
                <div className="space-y-2">
                  <Card className="p-0">
                    <CardContent className="p-0">
                      <iframe
                        src={`https://maps.google.com/maps?q=${getMapQuery()}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="位置プレビュー"
                        className="rounded-t-lg"
                      />
                      <div className="space-y-2 p-4">
                        <p className="text-muted-foreground text-xs">
                          <MapPin className="mr-1 inline h-3 w-3" />
                          <a
                            href={`https://maps.google.com/?q=${getMapQuery()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-700"
                          >
                            Google Mapsで開く
                          </a>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              {/* 画像アップロード */}
              <ImageUpload
                onImageChange={handleImageSelect}
                label="画像"
                placeholder="聖地の画像をアップロード"
                maxSize={5}
              />
              {/* 送信ボタン */}
              <Button
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                type="submit"
                className="w-full"
                size="lg"
              >
                {form.formState.isSubmitting ? "投稿中..." : "スポットを投稿"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-1 text-center text-muted-foreground text-sm">
        <p>* マークの付いた項目は必須です</p>
        <p>Google Maps URLから座標と住所を自動取得します</p>
        <p>登録された聖地は即座に公開されます</p>
      </div>
    </div>
  );
}
