const AnimatedConstruction = () => {
	return (
		<div className="flex h-96 items-center justify-center">
			<div className="rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white p-12 shadow-lg">
				<div className="flex flex-col items-center space-y-4">
					<div className="text-gray-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							className="h-16 w-16"
							fill="none"
							stroke="currentColor"
						>
							<title>Construction Icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
							/>
						</svg>
					</div>
					<div className="!mt-1 text-center">
						<h2 className="font-semibold text-3xl text-gray-700">
							Under Construction
						</h2>
						<div className="mt-2 text-gray-500 text-lg">
							UI Features for Operator Role Coming Soon
							<span className="inline-flex w-6 justify-center">
								<span className="w-1.5 animate-bounce [animation-delay:-0.3s]">
									.
								</span>
								<span className="w-1.5 animate-bounce [animation-delay:-0.2s]">
									.
								</span>
								<span className="w-1.5 animate-bounce [animation-delay:-0.1s]">
									.
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AnimatedConstruction;
