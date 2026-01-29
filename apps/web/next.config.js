/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => [
        { 
            source: "/trpc/:path*",
            destination: `${process.env.TRPC_URL}/:path*`,
        },
    ],
};

export default nextConfig;
