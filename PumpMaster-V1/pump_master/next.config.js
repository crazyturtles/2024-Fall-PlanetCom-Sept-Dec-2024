/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals.push("msnodesqlv8");
		}
		return config;
	},
};

module.exports = nextConfig;
