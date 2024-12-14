import {
	ChevronLeft,
	ChevronRight,
	Printer,
	RefreshCw,
	Settings,
	ZoomIn,
	ZoomOut,
} from "lucide-react";

interface PrintPreviewToolbarProps {
	currentPage: number;
	totalPages: number;
	zoom: number;
	onPrint: () => void;
	onNextPage: () => void;
	onPrevPage: () => void;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onRefresh?: () => void;
	onPageSetupClick?: () => void;
}

export function PrintPreviewToolbar({
	currentPage,
	totalPages,
	zoom,
	onPrint,
	onNextPage,
	onPrevPage,
	onZoomIn,
	onZoomOut,
	onRefresh,
	onPageSetupClick,
}: PrintPreviewToolbarProps) {
	return (
		<div className="sticky top-0 z-10 mx-2 mt-2 flex items-center gap-2 border-b bg-neutral-200 px-2 py-1 shadow">
			<button
				type="button"
				onClick={onPrint}
				className="flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 hover:bg-gray-100"
			>
				<Printer className="h-4 w-4" />
				Print
			</button>

			{onRefresh && (
				<>
					<div className="mx-2 h-4 w-px bg-gray-400" />
					<button
						type="button"
						onClick={onRefresh}
						className="flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 hover:bg-gray-100"
					>
						<RefreshCw className="h-4 w-4" />
						Refresh
					</button>
				</>
			)}

			<div className="mx-2 h-4 w-px bg-gray-400" />

			<button
				type="button"
				onClick={onPrevPage}
				disabled={currentPage <= 1}
				data-testid="prev-page-button"
				className="rounded border border-gray-300 bg-white p-1 text-gray-900 hover:bg-gray-100 disabled:bg-gray-100 disabled:opacity-50"
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			<div className="flex items-center gap-1 text-xs">
				<span className="text-gray-900">
					Page {currentPage} of {totalPages}
				</span>
			</div>

			<button
				type="button"
				onClick={onNextPage}
				disabled={currentPage >= totalPages}
				data-testid="next-page-button"
				className="rounded border border-gray-300 bg-white p-1 text-gray-900 hover:bg-gray-100 disabled:bg-gray-100 disabled:opacity-50"
			>
				<ChevronRight className="h-4 w-4" />
			</button>

			<div className="mx-2 h-4 w-px bg-gray-400" />

			<button
				type="button"
				onClick={onZoomOut}
				disabled={zoom <= 25}
				data-testid="zoom-out-button"
				className="rounded border border-gray-300 bg-white p-1 text-gray-900 hover:bg-gray-100 disabled:bg-gray-100 disabled:opacity-50"
			>
				<ZoomOut className="h-4 w-4" />
			</button>

			<select
				value={zoom}
				onChange={(e) => {
					const newZoom = Number(e.target.value);
					if (newZoom > zoom) onZoomIn();
					else onZoomOut();
				}}
				className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-900"
			>
				{[25, 50, 75, 100, 125, 150, 175, 200].map((level) => (
					<option key={level} value={level}>
						{level}%
					</option>
				))}
			</select>

			<button
				type="button"
				onClick={onZoomIn}
				disabled={zoom >= 200}
				data-testid="zoom-in-button"
				className="rounded border border-gray-300 bg-white p-1 text-gray-900 hover:bg-gray-100 disabled:bg-gray-100 disabled:opacity-50"
			>
				<ZoomIn className="h-4 w-4" />
			</button>

			{onPageSetupClick && (
				<>
					<div className="mx-2 h-4 w-px bg-gray-400" />
					<button
						type="button"
						onClick={onPageSetupClick}
						data-testid="page-setup-button"
						className="flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 hover:bg-gray-100"
					>
						<Settings className="h-4 w-4" />
						Page Setup
					</button>
				</>
			)}
		</div>
	);
}
