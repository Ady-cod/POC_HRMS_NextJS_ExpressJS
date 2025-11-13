/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/admin/employee/weekly",
        destination: "/admin/employee/week-wise",
        permanent: false,
      },
      {
        source: "/admin/employee/weekly/:path*",
        destination: "/admin/employee/week-wise/:path*",
        permanent: false,
      },
      {
        source: "/admin/employee/table",
        destination: "/admin/employee/list?migrated=table",
        permanent: false,
      },
      {
        source: "/admin/employee/table/:path*",
        destination: "/admin/employee/list/:path*?migrated=table",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // details → moved + path param (keeps original URL)
        {
          source: "/admin/employee/details",
          destination: "/moved/admin/employee/list",
        },
      ],
    };
  },
};
export default nextConfig;
