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
  const siswa = await prisma.orangTua.findUnique({
    where: { id: Number(id) },
    include: { siswa: true },
  });

  if (!siswa) {
    return NextResponse.json(
      { error: "Orang Tua tidak ditemukan" },
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
    const { nama, siswaId } = await request.json();

    if (!nama || !nama.trim()) {
      return NextResponse.json(
        { error: "Nama ortu wajib diisi" },
        { status: 400 },
      );
    }

    if (!siswaId) {
      return NextResponse.json(
        { error: "Siswa wajib dipilih" },
        { status: 400 },
      );
    }

    const siswa = await prisma.siswa.findUnique({
      where: { id: Number(siswaId) },
    });
    if (!siswa) {
      return NextResponse.json(
        { error: "Siswa tidak ditemukan" },
        { status: 404 },
      );
    }

    const ortu = await prisma.orangTua.update({
      where: { id: Number(id) },
      data: { nama: nama.trim(), siswaId: Number(siswaId) },
      include: { siswa: true },
    });

    return NextResponse.json(ortu);
  } catch (error) {
    console.error("Update ortu error:", error);
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
    const ortuId = Number(id);

    const ortu = await prisma.orangTua.findUnique({
      where: { id: ortuId },
    });

    if (!ortu) {
      return NextResponse.json(
        { error: "Ortu tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.orangTua.delete({ where: { id: ortuId } });

    return NextResponse.json({ message: "Orang Tua berhasil dihapus" });
  } catch (error) {
    console.error("Delete ortu error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
