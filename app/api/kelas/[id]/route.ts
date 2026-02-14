import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { error: "Tidak terautentikasi" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const kelas = await prisma.kelas.findUnique({
    where: { id: Number(id) },
    include: { guru: true, siswa: true },
  });

  if (!kelas) {
    return NextResponse.json(
      { error: "Kelas tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(kelas);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { error: "Tidak terautentikasi" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
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
    if (existing && existing.id !== Number(id)) {
      return NextResponse.json(
        { error: "Nama kelas sudah ada" },
        { status: 409 },
      );
    }

    const kelas = await prisma.kelas.update({
      where: { id: Number(id) },
      data: { nama: nama.trim() },
    });

    return NextResponse.json(kelas);
  } catch (error) {
    console.error("Update kelas error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { error: "Tidak terautentikasi" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const kelasId = Number(id);

    const kelas = await prisma.kelas.findUnique({
      where: { id: kelasId },
      include: { _count: { select: { guru: true, siswa: true } } },
    });

    if (!kelas) {
      return NextResponse.json(
        { error: "Kelas tidak ditemukan" },
        { status: 404 },
      );
    }

    if (kelas._count.guru > 0 || kelas._count.siswa > 0) {
      return NextResponse.json(
        {
          error: `Kelas tidak bisa dihapus karena masih memiliki ${kelas._count.guru} guru dan ${kelas._count.siswa} siswa`,
        },
        { status: 400 },
      );
    }

    await prisma.kelas.delete({ where: { id: kelasId } });

    return NextResponse.json({ message: "Kelas berhasil dihapus" });
  } catch (error) {
    console.error("Delete kelas error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
