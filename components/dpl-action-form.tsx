"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { processDplAction } from "@/app/dashboard/laporan/detail/[id]/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, MessageSquareReply } from "lucide-react";

// Fix the initial state type
const initialState = { message: "" };

function SubmitButtons() {
  const { pending } = useFormStatus();
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="submit"
        name="action"
        value="revisi"
        variant="destructive"
        disabled={pending}
      >
        <MessageSquareReply className="mr-2 h-4 w-4" />
        {pending ? "Mengirim..." : "Minta Revisi"}
      </Button>
      <Button
        type="submit"
        name="action"
        value="setujui"
        className="bg-green-600 hover:bg-green-700"
        disabled={pending}
      >
        <ThumbsUp className="mr-2 h-4 w-4" />
        {pending ? "Menyetujui..." : "Setujui Laporan"}
      </Button>
    </div>
  );
}

export function DplActionForm({ laporanId }: { laporanId: number }) {
  const [state, formAction] = useActionState(processDplAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi Verifikasi DPL</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="laporanId" value={laporanId} />
          <div>
            <Label htmlFor="feedback">Catatan / Feedback (Wajib diisi jika minta revisi)</Label>
            <Textarea
              id="feedback"
              name="feedback"
              placeholder="Berikan masukan atau catatan perbaikan untuk mahasiswa di sini..."
              rows={4}
            />
          </div>
          {state?.message && (
            <p className="text-sm text-red-500">{state.message}</p>
          )}
          <SubmitButtons />
        </form>
      </CardContent>
    </Card>
  );
}