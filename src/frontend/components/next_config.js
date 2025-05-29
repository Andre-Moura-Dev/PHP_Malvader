const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: 'auth/login',
                permanent: false,
            },
        ];
    },
};

module.exports = nextConfig;