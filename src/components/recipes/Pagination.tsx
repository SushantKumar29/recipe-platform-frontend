import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) => {
	if (totalPages <= 1) return null;

	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			let start = Math.max(2, currentPage - 1);
			let end = Math.min(totalPages - 1, currentPage + 1);

			if (currentPage <= 3) {
				start = 2;
				end = 4;
			} else if (currentPage >= totalPages - 2) {
				start = totalPages - 3;
				end = totalPages - 1;
			}

			pages.push(1);
			if (start > 2) pages.push("...");
			for (let i = start; i <= end; i++) pages.push(i);
			if (end < totalPages - 1) pages.push("...");
			pages.push(totalPages);
		}

		return pages;
	};

	return (
		<div className='flex justify-center mt-8'>
			<div className='flex items-center gap-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<ChevronLeft className='w-4 h-4 mr-1' />
					Previous
				</Button>

				<div className='flex items-center gap-1'>
					{getPageNumbers().map((pageNum, index) =>
						pageNum === "..." ? (
							<span key={`ellipsis-${index}`} className='px-3 py-1'>
								...
							</span>
						) : (
							<Button
								key={pageNum}
								variant={currentPage === pageNum ? "default" : "outline"}
								size='sm'
								onClick={() => onPageChange(pageNum as number)}
								className='min-w-10'
							>
								{pageNum}
							</Button>
						),
					)}
				</div>

				<Button
					variant='outline'
					size='sm'
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
					<ChevronRight className='w-4 h-4 ml-1' />
				</Button>
			</div>
		</div>
	);
};

export default Pagination;
