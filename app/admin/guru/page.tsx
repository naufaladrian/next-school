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

interface Kelas {
    id: number;
    nama: string;
}

interface Guru {
    id: number;
    nama: string;
    kelasId: number;
    kelas: Kelas;
}

export default function GuruPage() {
    const [guruList, setGuruList] = useState<Guru[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<Guru | null>(null);

    useEffect(() => {
        fetch("/api/guru")
            .then(res => res.ok ? res.json() : [])
            .then(data => setGuruList(data))
            .finally(() => setLoading(false));
    }, []);

    async function refreshData() {
        const res = await fetch("/api/guru");
        if (res.ok) setGuruList(await res.json());
    }

    async function handleDelete() {
        if (!selected) return;
        const res = await fetch(`/api/guru/${selected.id}`, { method: "DELETE" });
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
                <h1 className="text-2xl font-bold">Kelola Guru</h1>
                <Button asChild>
                    <Link href="/admin/guru/create">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Guru
                    </Link>
                </Button>
            </div>

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">No</TableHead>
                            <TableHead>Nama Guru</TableHead>
                            <TableHead>Kelas</TableHead>
                            <TableHead className="w-32 text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Memuat data...</TableCell>
                            </TableRow>
                        ) : guruList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Belum ada data guru</TableCell>
                            </TableRow>
                        ) : (
                            guruList.map((g, i) => (
                                <TableRow key={g.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell className="font-medium">{g.nama}</TableCell>
                                    <TableCell>{g.kelas.nama}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/guru/${g.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => { setSelected(g); setDeleteOpen(true); }}>
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
                        <AlertDialogTitle>Hapus Guru</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus guru <strong>{selected?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
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
