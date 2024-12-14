import { useEffect, useRef, useState } from "react";
import type { PageSetupState } from "../PageSetupModal";
import { PrintContent } from "./PrintContent";
import { PrintPreviewToolbar } from "./PrintPreviewToolbar";
import type { Column, HeaderGroup } from "./types/reportTypes";

interface PrintPreviewLayoutProps<T> {
	title: string;
	subtitle?: string;
	data: T[];
	columns: Column<T>[];
	headerGroups?: HeaderGroup[];
	currentPage: number;
	totalPages: number;
	zoom: number;
	pageSettings: PageSetupState;
	additionalHeaderContent?: React.ReactNode;
	onPrint: () => void;
	onNextPage: () => void;
	onPrevPage: () => void;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onRefresh?: () => void;
	onPageSetupClick?: () => void;
	children: React.ReactNode;
}

const getScale = (
	contentWidth: number,
	containerWidth: number,
	baseScale: number,
) => {
	if (contentWidth > containerWidth) {
		return (containerWidth / contentWidth) * baseScale;
	}
	return baseScale;
};

export default function PrintPreviewLayout<T>({
	title,
	subtitle,
	data,
	columns,
	headerGroups,
	currentPage,
	totalPages,
	zoom,
	pageSettings,
	additionalHeaderContent,
	onPrint,
	onNextPage,
	onPrevPage,
	onZoomIn,
	onZoomOut,
	onRefresh,
	onPageSetupClick,
	children,
}: PrintPreviewLayoutProps<T>) {
	const contentRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [autoScale, setAutoScale] = useState(1);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "p") {
				e.preventDefault();
				onPrint();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onPrint]);

	useEffect(() => {
		const updateScale = () => {
			if (contentRef.current && containerRef.current) {
				const contentWidth = contentRef.current.scrollWidth;
				const containerWidth = containerRef.current.clientWidth;
				setAutoScale(getScale(contentWidth, containerWidth, 1));
			}
		};

		updateScale();
		window.addEventListener("resize", updateScale);
		return () => window.removeEventListener("resize", updateScale);
	}, [data, zoom]);

	const { dimensions, margins, size, orientation } = pageSettings;
	const scale = (zoom / 100) * autoScale;

	const pageStyles = {
		// width: `${dimensions.width}mm`,
		// minHeight: `${dimensions.height}mm`,
		padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
		backgroundColor: "white",
		margin: "0 auto",
		boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
		transform: `scale(${scale})`,
		transformOrigin: "top center",
		fontSize: "0.75rem",
		lineHeight: "1rem",
	} as const;

	const tableStyles = `
    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 0.75rem;
      line-height: 1rem;
    }

    th, td {
      padding: 0.25rem 0.5rem;
      border: 1px solid #e5e7eb;
    }

    th {
      font-weight: 500;
      text-align: left;
      background-color: #f9fafb;
    }

    td {
      vertical-align: top;
    }

    thead th[colspan] {
      background-color: #f3f4f6;
    }

    tbody tr:nth-child(even) {
      background-color: #f9fafb;
    }

    .print-preview-content {
    //   width: ${dimensions.width - margins.left - margins.right}mm;
    //   min-height: ${dimensions.height - margins.top - margins.bottom}mm;
    //   overflow: visible;
    }
  `;

	const printStyles = `
    @page {
      size: ${size.toLowerCase()} ${orientation};
      margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }

      .navbar, nav {
        display: none !important;
      }

      .print-content {
        margin: 0 !important;
        padding: 0 !important;
      }
    }
  `;

	const toolbarProps = {
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
	};

	const printProps = {
		data,
		columns,
		headerGroups,
		title,
		subtitle,
		additionalHeaderContent,
		pageSettings,
	};

	return (
		<>
			<style>{tableStyles}</style>
			<style type="text/css" media="print">
				{printStyles}
			</style>

			<div className="flex min-h-screen flex-col bg-gray-100 print:hidden">
				<PrintPreviewToolbar {...toolbarProps} />
				<div className="flex-1 overflow-auto p-4" ref={containerRef}>
					<div style={pageStyles}>
						<div className="print-preview-content" ref={contentRef}>
							{children}
						</div>
					</div>
				</div>
			</div>

			<div className="hidden print:block">
				<PrintContent {...printProps} />
			</div>
		</>
	);
}
