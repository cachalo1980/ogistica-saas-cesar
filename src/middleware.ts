import middleware from "next-auth/middleware";

export default middleware;

export const config = {
    // Protegemos todas las rutas bajo /dashboard
    matcher: ["/dashboard/:path*"],
};
