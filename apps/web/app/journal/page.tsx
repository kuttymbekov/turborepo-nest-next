"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth } from "date-fns";
import { PlusIcon, ArrowUpDownIcon, Pencil, Trash2 } from "lucide-react";

import {
  workEntriesApi,
  type WorkEntry,
  type WorkEntriesParams,
} from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EntryDialog } from "./entry-dialog";
import { DeleteDialog } from "./delete-dialog";

const DEFAULT_FROM = format(startOfMonth(new Date()), "yyyy-MM-dd");
const DEFAULT_TO = format(new Date(), "yyyy-MM-dd");

export default function Page() {
  return (
    <Suspense>
      <JournalPage />
    </Suspense>
  );
}

function JournalPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") ?? DEFAULT_FROM;
  const to = searchParams.get("to") ?? DEFAULT_TO;
  const sort = (searchParams.get("sort") as "asc" | "desc") ?? "desc";

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set(key, value);
    router.replace(`?${p.toString()}`);
  };

  const resetFilters = () => {
    router.replace(`?from=${DEFAULT_FROM}&to=${DEFAULT_TO}&sort=${sort}`);
  };

  const [addOpen, setAddOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<WorkEntry | null>(null);
  const [deleteEntry, setDeleteEntry] = useState<WorkEntry | null>(null);

  const params: WorkEntriesParams = { from, to, sort };

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["work-entries", params],
    queryFn: () => workEntriesApi.getAll(params),
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayCount = entries.filter((e) => e.date.startsWith(todayStr)).length;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["work-entries"] });

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Журнал работ</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Учёт выполненных работ на строительном объекте
            </p>
          </div>
          <div className="flex items-center gap-3">
            {todayCount > 0 && (
              <Badge variant="secondary">Сегодня: {todayCount}</Badge>
            )}
            <Button onClick={() => setAddOpen(true)}>
              <PlusIcon className="size-4" />
              Добавить запись
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-background rounded-xl border border-border p-4 mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              С:
            </span>
            <Input
              type="date"
              value={from}
              onChange={(e) => setParam("from", e.target.value)}
              className="w-36 h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              По:
            </span>
            <Input
              type="date"
              value={to}
              onChange={(e) => setParam("to", e.target.value)}
              className="w-36 h-8"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setParam("sort", sort === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDownIcon className="size-4" />
            Дата: {sort === "desc" ? "сначала новые" : "сначала старые"}
          </Button>
          {(from !== DEFAULT_FROM || to !== DEFAULT_TO) && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Сбросить
            </Button>
          )}
          <span className="ml-auto text-sm text-muted-foreground">
            {entries.length} {pluralEntries(entries.length)}
          </span>
        </div>

        {/* Table */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Дата</TableHead>
                <TableHead>Вид работ</TableHead>
                <TableHead className="w-36">Объём</TableHead>
                <TableHead className="w-52">Исполнитель</TableHead>
                <TableHead>Примечание</TableHead>
                <TableHead className="w-24 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : entries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-40 text-center text-muted-foreground"
                  >
                    Нет записей. Добавьте первую запись в журнал.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium tabular-nums">
                      {format(new Date(entry.date), "dd.MM.yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{entry.workType.name}</Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {entry.volume} {entry.unit}
                    </TableCell>
                    <TableCell>{entry.executor}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {entry.notes ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setEditEntry(entry)}
                          title="Редактировать"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteEntry(entry)}
                          title="Удалить"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialogs */}
        <EntryDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          onSuccess={() => {
            invalidate();
            setAddOpen(false);
          }}
        />
        <EntryDialog
          open={!!editEntry}
          onOpenChange={(open) => !open && setEditEntry(null)}
          entry={editEntry ?? undefined}
          onSuccess={() => {
            invalidate();
            setEditEntry(null);
          }}
        />
        <DeleteDialog
          entry={deleteEntry}
          onOpenChange={(open) => !open && setDeleteEntry(null)}
          onSuccess={() => {
            invalidate();
            setDeleteEntry(null);
          }}
        />
      </div>
    </div>
  );
}

function pluralEntries(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return "записей";
  if (mod10 === 1) return "запись";
  if (mod10 >= 2 && mod10 <= 4) return "записи";
  return "записей";
}
