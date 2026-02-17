"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Siswa {
    id: number;
    nama: string;
}

export default function EditSiswaPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [siswaList, setSiswaList] = useState<Siswa[]>([]);
    const [nama, setNama] = useState("");
    const [siswaId, setSiswaId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([fetch(`/api/ortu/${id}`), fetch("/api/siswa")])
            .then(async ([ortuRes, siswaRes]) => {
                if (siswaRes.ok) {
                    const ortu = await ortuRes.json();
                    setNama(ortu.nama);
                    setSiswaId(String(ortu.siswaId));
                } else {
                    setError("Ortu tidak ditemukan");
                }
                if (siswaRes.ok) setSiswaList(await siswaRes.json());
            })
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const res = await fetch(`/api/ortu/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama, siswaId: Number(siswaId) }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Terjadi kesalahan");
            setSubmitting(false);
            return;
        }
        router.push("/admin/ortu");
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
            <Link href="/admin/siswa" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Kelola Ortu
            </Link>

            <Card className="mx-auto mt-4 max-w-lg">
                <CardHeader>
                    <CardTitle>Edit Siswa</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Ortu</Label>
                            <Input
                                id="nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="ortu"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Siswa</Label>
                            <Select value={siswaId} onValueChange={setSiswaId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {siswaList.map((k) => (
                                        <SelectItem key={k.id} value={String(k.id)}>
                                            {k.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <div className="flex gap-2">
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Menyimpan..." : "Simpan"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.push("/admin/siswa")}>
                                Batal
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
