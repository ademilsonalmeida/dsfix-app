import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth handler - types will be properly configured in Task 3
const handler = NextAuth(authOptions) as never;

export { handler as GET, handler as POST };
