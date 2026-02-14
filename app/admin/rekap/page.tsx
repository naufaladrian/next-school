"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface Siswa {
    id: number;
    nama: string;
}

interface Guru {
    id: number;
    nama: string;
}

interface KelasRekap {
    id: number;
    nama: string;
    siswa: Siswa[];
    guru: Guru[];
}

export default function RekapPage() {
    const [data, setData] = useState<KelasRekap[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/rekap")
            .then(res => res.ok ? res.json() : [])
            .then(data => setData(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div>
                <h1 className="mb-6 text-2xl font-bold">Rekap Data</h1>
                <p className="text-muted-foreground">Memuat data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <h1 className="text-2xl font-bold">Rekap Data</h1>

            {/* Table 1: Siswa per Kelas */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">Daftar Siswa per Kelas</h2>
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-48">Kelas</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell>
                                </TableRow>
                            ) : (
                                data.map((kelas) => {
                                    const count = Math.max(kelas.siswa.length, 1);
                                    return kelas.siswa.length === 0 ? (
                                        <TableRow key={kelas.id}>
                                            <TableCell className="font-medium align-top">{kelas.nama}</TableCell>
                                            <TableCell className="text-muted-foreground italic">Belum ada siswa</TableCell>
                                        </TableRow>
                                    ) : (
                                        kelas.siswa.map((siswa, idx) => (
                                            <TableRow key={`s-${kelas.id}-${siswa.id}`}>
                                                {idx === 0 && (
                                                    <TableCell className="font-medium align-top" rowSpan={count}>{kelas.nama}</TableCell>
                                                )}
                                                <TableCell>{siswa.nama}</TableCell>
                                            </TableRow>
                                        ))
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </section>

            <Separator />

            {/* Table 2: Guru per Kelas */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">Daftar Guru per Kelas</h2>
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-48">Kelas</TableHead>
                                <TableHead>Nama Guru</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell>
                                </TableRow>
                            ) : (
                                data.map((kelas) => {
                                    const count = Math.max(kelas.guru.length, 1);
                                    return kelas.guru.length === 0 ? (
                                        <TableRow key={kelas.id}>
                                            <TableCell className="font-medium align-top">{kelas.nama}</TableCell>
                                            <TableCell className="text-muted-foreground italic">Belum ada guru</TableCell>
                                        </TableRow>
                                    ) : (
                                        kelas.guru.map((guru, idx) => (
                                            <TableRow key={`g-${kelas.id}-${guru.id}`}>
                                                {idx === 0 && (
                                                    <TableCell className="font-medium align-top" rowSpan={count}>{kelas.nama}</TableCell>
                                                )}
                                                <TableCell>{guru.nama}</TableCell>
                                            </TableRow>
                                        ))
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </section>

            <Separator />

            {/* Table 3: Siswa, Kelas, Guru */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">Daftar Siswa, Kelas, dan Guru</h2>
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-48">Kelas</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Nama Guru</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell>
                                </TableRow>
                            ) : (
                                data.map((kelas) => {
                                    const rowCount = Math.max(kelas.siswa.length, kelas.guru.length, 1);
                                    return Array.from({ length: rowCount }).map((_, idx) => (
                                        <TableRow key={`all-${kelas.id}-${idx}`}>
                                            {idx === 0 && (
                                                <TableCell className="font-medium align-top" rowSpan={rowCount}>{kelas.nama}</TableCell>
                                            )}
                                            <TableCell>
                                                {kelas.siswa[idx]?.nama || (idx === 0 && kelas.siswa.length === 0 ? <span className="text-muted-foreground italic">-</span> : "")}
                                            </TableCell>
                                            <TableCell>
                                                {kelas.guru[idx]?.nama || (idx === 0 && kelas.guru.length === 0 ? <span className="text-muted-foreground italic">-</span> : "")}
                                            </TableCell>
                                        </TableRow>
                                    ));
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </div>
    );
}
