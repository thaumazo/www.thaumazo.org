import type { NextConfig } from "next";

const s3Bucket = process.env.AWS_S3_BUCKET ?? process.env.S3_BUCKET;
const s3Region = process.env.AWS_S3_REGION ?? process.env.AWS_REGION;
const configuredS3Patterns = s3Bucket
  ? [
      ...(s3Region
        ? [
            new URL(`https://${s3Bucket}.s3.${s3Region}.amazonaws.com/**`),
            new URL(`https://s3.${s3Region}.amazonaws.com/${s3Bucket}/**`),
          ]
        : []),
      new URL(`https://${s3Bucket}.s3.amazonaws.com/**`),
      new URL(`https://s3.amazonaws.com/${s3Bucket}/**`),
    ]
  : [];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  images: {
    remotePatterns: [
      new URL("https://thaumazo-test.s3.us-east-1.amazonaws.com/**"),
      new URL("https://thaumazo.s3.us-east-1.amazonaws.com/**"),
      ...configuredS3Patterns,
    ],
  },
};

export default nextConfig;
