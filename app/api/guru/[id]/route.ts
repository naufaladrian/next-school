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
  const guru = await prisma.guru.findUnique({
    where: { id: Number(id) },
    include: { kelas: true },
  });

  if (!guru) {
    return NextResponse.json(
      { error: "Guru tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(guru);
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

    const guru = await prisma.guru.update({
      where: { id: Number(id) },
      data: { nama: nama.trim(), kelasId: Number(kelasId) },
      include: { kelas: true },
    });

    return NextResponse.json(guru);
  } catch (error) {
    console.error("Update guru error:", error);
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
    const guruId = Number(id);

    const guru = await prisma.guru.findUnique({
      where: { id: guruId },
    });

    if (!guru) {
      return NextResponse.json(
        { error: "Guru tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.guru.delete({ where: { id: guruId } });

    return NextResponse.json({ message: "Guru berhasil dihapus" });
  } catch (error) {
    console.error("Delete guru error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
