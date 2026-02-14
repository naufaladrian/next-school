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

  const guru = await prisma.guru.findMany({
    orderBy: { id: "desc" },
    include: { kelas: true },
  });

  return NextResponse.json(guru);
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
    const { nama, kelasId } = await request.json();

    if (!nama || !nama.trim()) {
      return NextResponse.json(
        { error: "Nama guru wajib diisi" },
        { status: 400 },
      );
    }

    if (!kelasId) {
      return NextResponse.json(
        { error: "Kelas wajib dipilih" },
        { status: 400 },
      );
    }

    const kelas = await prisma.kelas.findUnique({
      where: { id: Number(kelasId) },
    });
    if (!kelas) {
      return NextResponse.json(
        { error: "Kelas tidak ditemukan" },
        { status: 404 },
      );
    }

    const guru = await prisma.guru.create({
      data: { nama: nama.trim(), kelasId: Number(kelasId) },
      include: { kelas: true },
    });

    return NextResponse.json(guru, { status: 201 });
  } catch (error) {
    console.error("Create guru error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
