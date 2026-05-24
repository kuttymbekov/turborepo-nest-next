"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

import { workEntriesApi, workTypesApi, type WorkEntry } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const UNITS = ["м²", "м³", "шт", "п.м.", "т", "л", "кг"];

const schema = z.object({
  date: z.string().min(1, "Укажите дату"),
  workTypeId: z.string().min(1, "Выберите вид работ"),
  volume: z.coerce
    .number({ invalid_type_error: "Введите число" })
    .positive("Объём должен быть больше 0"),
  unit: z.string().min(1, "Выберите единицу измерения"),
  executor: z.string().min(2, "Минимум 2 символа"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: WorkEntry;
  onSuccess: () => void;
}

export function EntryDialog({
  open,
  onOpenChange,
  entry,
  onSuccess,
}: EntryDialogProps) {
  const isEdit = !!entry;

  const { data: workTypes = [] } = useQuery({
    queryKey: ["work-types"],
    queryFn: workTypesApi.getAll,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      workTypeId: "",
      unit: "м²",
      executor: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (entry) {
      reset({
        date: format(new Date(entry.date), "yyyy-MM-dd"),
        workTypeId: entry.workTypeId,
        volume: entry.volume,
        unit: entry.unit,
        executor: entry.executor,
        notes: entry.notes ?? "",
      });
    } else {
      reset({
        date: format(new Date(), "yyyy-MM-dd"),
        workTypeId: "",
        volume: undefined,
        unit: "м²",
        executor: "",
        notes: "",
      });
    }
  }, [open, entry, reset]);

  const createMutation = useMutation({
    mutationFn: workEntriesApi.create,
    onSuccess: () => {
      toast.success("Запись добавлена");
      onSuccess();
    },
    onError: () => toast.error("Ошибка при добавлении"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormValues }) =>
      workEntriesApi.update(id, data),
    onSuccess: () => {
      toast.success("Запись обновлена");
      onSuccess();
    },
    onError: () => toast.error("Ошибка при обновлении"),
  });

  const onSubmit = (values: FormValues) => {
    if (isEdit) {
      updateMutation.mutate({ id: entry.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Редактировать запись" : "Новая запись"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date">Дата выполнения</Label>
            <Input
              id="date"
              type="date"
              defaultValue={format(new Date(), "yyyy-MM-dd")}
              {...register("date")}
              aria-invalid={!!errors.date}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Work Type */}
          <div className="space-y-1.5">
            <Label>Вид работ</Label>
            <Controller
              control={control}
              name="workTypeId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.workTypeId}
                  >
                    <SelectValue placeholder="Выберите вид работ">
                      {workTypes.find((wt) => wt.id === field.value)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {workTypes.map((wt) => (
                      <SelectItem key={wt.id} value={wt.id}>
                        {wt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.workTypeId && (
              <p className="text-xs text-destructive">
                {errors.workTypeId.message}
              </p>
            )}
          </div>

          {/* Volume + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="volume">Объём</Label>
              <Input
                id="volume"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...register("volume")}
                aria-invalid={!!errors.volume}
              />
              {errors.volume && (
                <p className="text-xs text-destructive">
                  {errors.volume.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Единица измерения</Label>
              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!errors.unit}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Executor */}
          <div className="space-y-1.5">
            <Label htmlFor="executor">Исполнитель (ФИО)</Label>
            <Input
              id="executor"
              placeholder="Иванов Иван Иванович"
              {...register("executor")}
              aria-invalid={!!errors.executor}
            />
            {errors.executor && (
              <p className="text-xs text-destructive">
                {errors.executor.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Примечание (необязательно)</Label>
            <Input
              id="notes"
              placeholder="Дополнительная информация"
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Сохранение..."
                : isEdit
                  ? "Сохранить изменения"
                  : "Добавить запись"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
