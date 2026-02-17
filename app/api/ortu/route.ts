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

  const ortu = await prisma.orangTua.findMany({
    orderBy: { id: "desc" },
    include: { siswa: true },
  });

  return NextResponse.json(ortu);
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
    const { nama, siswaId } = await request.json();

    if (!nama || !nama.trim()) {
      return NextResponse.json(
        { error: "Nama orang tua wajib diisi" },
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

    const ortu = await prisma.orangTua.create({
      data: { nama: nama.trim(), siswaId: Number(siswaId) },
      include: { siswa: true },
    });

    return NextResponse.json(ortu, { status: 201 });
  } catch (error) {
    console.error("Create ortu error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
