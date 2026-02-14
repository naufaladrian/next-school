"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Users, School, GraduationCap, LayoutDashboard, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/siswa", label: "Siswa", icon: Users },
    { href: "/admin/kelas", label: "Kelas", icon: School },
    { href: "/admin/guru", label: "Guru", icon: GraduationCap },
    { href: "/admin/rekap", label: "Rekap", icon: ClipboardList },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="flex w-64 flex-col border-r bg-card">
                <div className="border-b p-6">
                    <h1 className="text-xl font-bold">Next School</h1>
                    <p className="text-sm text-muted-foreground">Admin Panel</p>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                    {sidebarLinks.map((link) => {
                        const isActive =
                            link.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t p-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-muted/30 p-8">
                {children}
            </main>
        </div>
    );
}
