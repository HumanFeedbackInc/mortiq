/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', "i.pravatar.cc","assets.aceternity.com","nextuipro.nyc3.cdn.digitaloceanspaces.com", "tvwojwmrfzfxpelinlal.supabase.co"],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb'
        }
    },
    api: {
        bodyParser: {
            sizeLimit: '50mb'
        }
    }
};

module.exports = nextConfig;
