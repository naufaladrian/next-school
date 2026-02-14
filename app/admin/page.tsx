import { Users, School, GraduationCap } from "lucide-react";
import Link from "next/link";

const stats = [
    { label: "Siswa", href: "/admin/siswa", icon: Users },
    { label: "Kelas", href: "/admin/kelas", icon: School },
    { label: "Guru", href: "/admin/guru", icon: GraduationCap },
];

export default function Page() {
    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted"
                    >
                        <item.icon className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-lg font-semibold">Kelola {item.label}</p>
                            <p className="text-sm text-muted-foreground">
                                Manage data {item.label.toLowerCase()}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
