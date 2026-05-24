"use client";

import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

import { workEntriesApi, type WorkEntry } from "@/api/client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  entry: WorkEntry | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteDialog({
  entry,
  onOpenChange,
  onSuccess,
}: DeleteDialogProps) {
  const deleteMutation = useMutation({
    mutationFn: () => workEntriesApi.delete(entry!.id),
    onSuccess: () => {
      toast.success("Запись удалена");
      onSuccess();
    },
    onError: () => toast.error("Ошибка при удалении"),
  });

  return (
    <AlertDialog open={!!entry} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
          <AlertDialogDescription>
            {entry && (
              <>
                <span className="font-medium text-foreground">
                  {entry.workType.name}
                </span>{" "}
                — {format(new Date(entry.date), "dd.MM.yyyy")},{" "}
                {entry.volume} {entry.unit}, {entry.executor}
              </>
            )}
            <br />
            Это действие необратимо.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
