"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Siswa {
    id: number;
    nama: string;
}

interface Ortu {
    id: number;
    nama: string;
    kelasId: number;
    siswa: Siswa;
}

export default function OrtuPage() {
    const [ortuList, setOrtuList] = useState<Ortu[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<Ortu | null>(null);

    useEffect(() => {
        fetch("/api/ortu")
            .then(res => res.ok ? res.json() : [])
            .then(data => setOrtuList(data))
            .finally(() => setLoading(false));
    }, []);

    async function refreshData() {
        const res = await fetch("/api/ortu");
        if (res.ok) setOrtuList(await res.json());
    }

    async function handleDelete() {
        if (!selected) return;
        const res = await fetch(`/api/ortu/${selected.id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) {
            alert(data.error || "Gagal menghapus");
        }
        setDeleteOpen(false);
        refreshData();
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Kelola Ortu</h1>
                <Button asChild>
                    <Link href="/admin/ortu/create">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Ortu
                    </Link>
                </Button>
            </div>

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">No</TableHead>
                            <TableHead>Nama Orang Tua</TableHead>
                            <TableHead>Siswa</TableHead>
                            <TableHead className="w-32 text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Memuat data...</TableCell>
                            </TableRow>
                        ) : ortuList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Belum ada data ortu</TableCell>
                            </TableRow>
                        ) : (
                            ortuList.map((s, i) => (
                                <TableRow key={s.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell className="font-medium">{s.nama}</TableCell>
                                    <TableCell>{s.siswa.nama}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/ortu/${s.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => { setSelected(s); setDeleteOpen(true); }}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Ortu</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus ortu <strong>{selected?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
