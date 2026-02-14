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
  const siswa = await prisma.siswa.findUnique({
    where: { id: Number(id) },
    include: { kelas: true },
  });

  if (!siswa) {
    return NextResponse.json(
      { error: "Siswa tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(siswa);
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
        { error: "Nama siswa wajib diisi" },
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

    const siswa = await prisma.siswa.update({
      where: { id: Number(id) },
      data: { nama: nama.trim(), kelasId: Number(kelasId) },
      include: { kelas: true },
    });

    return NextResponse.json(siswa);
  } catch (error) {
    console.error("Update siswa error:", error);
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
    const siswaId = Number(id);

    const siswa = await prisma.siswa.findUnique({
      where: { id: siswaId },
    });

    if (!siswa) {
      return NextResponse.json(
        { error: "Siswa tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.siswa.delete({ where: { id: siswaId } });

    return NextResponse.json({ message: "Siswa berhasil dihapus" });
  } catch (error) {
    console.error("Delete siswa error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
