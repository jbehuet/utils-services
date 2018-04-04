const config = {
    public: 'public',
    index: 'index.html',
    port: process.env.PORT || 3000,
    allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []
};

export default config;