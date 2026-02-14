import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 },
      );
    }

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    // Verifikasi password
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    // Buat JWT token
    const token = await createToken({
      userId: user.id,
      username: user.username,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      message: "Login berhasil",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
