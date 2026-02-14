"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface Kelas {
    id: number;
    nama: string;
}

export default function CreateGuruPage() {
    const router = useRouter();
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [nama, setNama] = useState("");
    const [kelasId, setKelasId] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch("/api/kelas")
            .then(res => res.ok ? res.json() : [])
            .then(data => setKelasList(data));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const res = await fetch("/api/guru", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama, kelasId: Number(kelasId) }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Terjadi kesalahan");
            setSubmitting(false);
            return;
        }
        router.push("/admin/guru");
    }

    return (
        <div>
            <Link href="/admin/guru" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Kelola Guru
            </Link>

            <Card className="mx-auto mt-4 max-w-lg">
                <CardHeader>
                    <CardTitle>Tambah Guru</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Guru</Label>
                            <Input
                                id="nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Masukkan nama guru"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Kelas</Label>
                            <Select value={kelasId} onValueChange={setKelasId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kelasList.map((k) => (
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
                            <Button type="button" variant="outline" onClick={() => router.push("/admin/guru")}>
                                Batal
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
