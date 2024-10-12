/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
   remotePatterns: [
     {
       protocol: 'https',
       hostname: 'res.cloudinary.com',
       port: '',   // Leave empty since Cloudinary uses the default HTTPS port
       pathname: '/**',  // Allow any path under res.cloudinary.com
     },
   ],
 },
};

export default nextConfig;
