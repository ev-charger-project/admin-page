/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/dashboard',
                destination: '/dashboard/ev-chargers',
                permanent: true,
            },
        ]
    },
    reactStrictMode: true,
    compiler:{
        styledComponents: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '172.16.11.139',
                port: '14000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '14000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;
