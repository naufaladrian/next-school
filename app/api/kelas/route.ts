import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { error: "Tidak terautentikasi" },
      { status: 401 },
    );
  }

  const kelas = await prisma.kelas.findMany({
    orderBy: { nama: "asc" },
    include: {
      _count: { select: { guru: true, siswa: true } },
    },
  });

  return NextResponse.json(kelas);
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { error: "Tidak terautentikasi" },
      { status: 401 },
    );
  }

  try {
    const { nama } = await request.json();

    if (!nama || !nama.trim()) {
      return NextResponse.json(
        { error: "Nama kelas wajib diisi" },
        { status: 400 },
      );
    }

    const existing = await prisma.kelas.findUnique({
      where: { nama: nama.trim() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Nama kelas sudah ada" },
        { status: 409 },
      );
    }

    const kelas = await prisma.kelas.create({
      data: { nama: nama.trim() },
    });

    return NextResponse.json(kelas, { status: 201 });
  } catch (error) {
    console.error("Create kelas error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
