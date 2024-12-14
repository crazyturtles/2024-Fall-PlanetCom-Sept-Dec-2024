/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
		config.module.rules.push({
			test: /\.node$/,
			use: [
				{
					loader: "nextjs-node-loader",
				},
			],
		});
		return config;
	},
	//output: "export",
};

export default nextConfig;
