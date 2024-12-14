import { useCallback, useState } from "react";

export interface PrintPreviewState {
	currentPage: number;
	zoom: number;
	totalPages: number;
}

export interface PrintPreviewActions {
	setZoom: (newZoom: number) => void;
	setPage: (newPage: number) => void;
	setTotalPages: (pages: number) => void;
	nextPage: () => void;
	prevPage: () => void;
	zoomIn: () => void;
	zoomOut: () => void;
}

export function usePrintPreview(
	initialTotalPages = 1,
): PrintPreviewState & PrintPreviewActions {
	const [state, setState] = useState<PrintPreviewState>({
		currentPage: 1,
		zoom: 100,
		totalPages: initialTotalPages,
	});

	const setZoom = useCallback((newZoom: number) => {
		setState((prev) => ({
			...prev,
			zoom: Math.min(Math.max(newZoom, 25), 200),
		}));
	}, []);

	const setPage = useCallback((newPage: number) => {
		setState((prev) => ({
			...prev,
			currentPage: Math.min(Math.max(newPage, 1), prev.totalPages),
		}));
	}, []);

	const setTotalPages = useCallback((pages: number) => {
		setState((prev) => ({
			...prev,
			totalPages: pages,
			currentPage: Math.min(prev.currentPage, pages),
		}));
	}, []);

	return {
		...state,
		setZoom,
		setPage,
		setTotalPages,
		nextPage: () => setPage(state.currentPage + 1),
		prevPage: () => setPage(state.currentPage - 1),
		zoomIn: () => setZoom(state.zoom + 25),
		zoomOut: () => setZoom(state.zoom - 25),
	};
}
