export { default } from "next-auth/middleware";

export const config = {
    // Protegemos todas las rutas bajo /dashboard
    matcher: ["/dashboard/:path*"],
};
