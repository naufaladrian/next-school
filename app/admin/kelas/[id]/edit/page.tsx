"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditKelasPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [nama, setNama] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(`/api/kelas/${id}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) setNama(data.nama);
                else setError("Kelas tidak ditemukan");
            })
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const res = await fetch(`/api/kelas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Terjadi kesalahan");
            setSubmitting(false);
            return;
        }
        router.push("/admin/kelas");
    }

    if (loading) {
        return (
            <div>
                <p className="text-muted-foreground">Memuat data...</p>
            </div>
        );
    }

    return (
        <div>
            <Link href="/admin/kelas" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Kelola Kelas
            </Link>

            <Card className="mx-auto mt-4 max-w-lg">
                <CardHeader>
                    <CardTitle>Edit Kelas</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Kelas</Label>
                            <Input
                                id="nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Contoh: X-A"
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <div className="flex gap-2">
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Menyimpan..." : "Simpan"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.push("/admin/kelas")}>
                                Batal
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
