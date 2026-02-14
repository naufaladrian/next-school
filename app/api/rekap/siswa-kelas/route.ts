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
      siswa: { orderBy: { nama: "asc" } },
    },
  });

  return NextResponse.json(kelas);
}
