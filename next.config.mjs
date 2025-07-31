//** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['readdy.ai', 'res.cloudinary.com'], // ✅ Added Cloudinary
  },
};

export default nextConfig;
