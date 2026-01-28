import { api } from "./client";

/* =========================
   로그인
========================= */
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

/* =========================
   회원가입
========================= */
export const signup = (data: {
  email: string;
  password: string;
  name?: string;
  gender?: "M" | "F" | null;
  birthYear?: number;
  concerns?: string[];
}) =>
  api.post("/auth/signup", data);

/* =========================
   🔥 이메일 인증 재전송
========================= */
export const resendVerifyEmail = (email: string) =>
  api.post("/auth/resend-verify-email", null, {
    params: { email },
  });
