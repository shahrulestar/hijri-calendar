import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/api/mcp",
        destination: "/mcp",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
