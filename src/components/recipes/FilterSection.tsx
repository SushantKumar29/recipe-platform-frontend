import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { RecipeFilters } from "@/types/recipes/recipeTypes";
import { useState } from "react";
import RatingStars from "./RatingStars";

interface FilterSectionProps {
	filters: {
		preparationTime: string;
		minRating: number | string;
		sortBy: string;
		sortOrder: string;
		authorId?: string;
	};
	onFilterChange: (key: keyof RecipeFilters, value: any) => void;
	onClearFilters: () => void;
	hasActiveFilters: boolean;
}

const FilterSection = ({
	filters,
	onFilterChange,
	onClearFilters,
	hasActiveFilters,
}: FilterSectionProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleSortChange = (value: string) => {
		const [sortBy, sortOrder] = value.split("-");
		onFilterChange("sortBy", sortBy);
		onFilterChange("sortOrder", sortOrder);
	};

	return (
		<div className='bg-white rounded-lg border'>
			<div className='lg:hidden border-b'>
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className='flex items-center justify-between w-full p-2 hover:bg-gray-50'
				>
					<div className='flex items-center gap-3'>
						<Filter className='w-5 h-5' />
						<div className='text-left'>
							<h3 className='font-semibold'>Filters</h3>
							{hasActiveFilters && (
								<p className='text-xs text-gray-500 mt-0.5'>
									{filters.preparationTime &&
										`Time: ${filters.preparationTime} `}
									{filters.minRating !== "" && `Rating: ${filters.minRating}+ `}
								</p>
							)}
						</div>
					</div>
					{isExpanded ? (
						<ChevronUp className='w-5 h-5 text-gray-400' />
					) : (
						<ChevronDown className='w-5 h-5 text-gray-400' />
					)}
				</button>
			</div>

			<div className='hidden lg:flex items-center justify-between p-2 border-b'>
				<h3 className='font-semibold flex items-center gap-2'>
					<Filter className='w-4 h-4' />
					Filters
				</h3>
				{hasActiveFilters && (
					<Button variant='ghost' size='sm' onClick={onClearFilters}>
						<X className='w-4 h-4 mr-1' />
						Clear
					</Button>
				)}
			</div>

			<div className={`${isExpanded ? "block" : "hidden lg:block"}`}>
				{hasActiveFilters && (
					<div className='hidden lg:block p-4 border-b'>
						<div className='flex flex-wrap gap-2'>
							{filters.preparationTime && (
								<Badge variant='secondary' className='flex items-center gap-1'>
									Time: {filters.preparationTime}
									<button
										onClick={() => onFilterChange("preparationTime", "")}
										className='ml-1 hover:text-gray-700'
									>
										<X className='w-3 h-3' />
									</button>
								</Badge>
							)}
							{filters.minRating !== "" && (
								<Badge variant='secondary' className='flex items-center gap-1'>
									Rating: {filters.minRating}+
									<button
										onClick={() => onFilterChange("minRating", "")}
										className='ml-1 hover:text-gray-700'
									>
										<X className='w-3 h-3' />
									</button>
								</Badge>
							)}
						</div>
					</div>
				)}

				{hasActiveFilters && isExpanded && (
					<div className='lg:hidden p-4 border-b bg-gray-50'>
						<div className='flex justify-between items-center mb-2'>
							<span className='text-sm font-medium text-gray-700'>
								Active Filters:
							</span>
							<Button variant='ghost' size='sm' onClick={onClearFilters}>
								<X className='w-3 h-3 mr-1' />
								Clear All
							</Button>
						</div>
						<div className='flex flex-wrap gap-2'>
							{filters.preparationTime && (
								<Badge variant='secondary' className='flex items-center gap-1'>
									Time: {filters.preparationTime}
									<button
										onClick={() => onFilterChange("preparationTime", "")}
										className='ml-1 hover:text-gray-700'
									>
										<X className='w-3 h-3' />
									</button>
								</Badge>
							)}
							{filters.minRating !== "" && (
								<Badge variant='secondary' className='flex items-center gap-1'>
									Rating: {filters.minRating}+
									<button
										onClick={() => onFilterChange("minRating", "")}
										className='ml-1 hover:text-gray-700'
									>
										<X className='w-3 h-3' />
									</button>
								</Badge>
							)}
						</div>
					</div>
				)}

				<div className='p-4 space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Preparation Time
						</label>
						<Select
							value={filters.preparationTime || "all"}
							onValueChange={(value) =>
								onFilterChange("preparationTime", value === "all" ? "" : value)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='All times' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All times</SelectItem>
								<SelectItem value='0-30'>0-30 minutes</SelectItem>
								<SelectItem value='30-60'>30-60 minutes</SelectItem>
								<SelectItem value='60-120'>1-2 hours</SelectItem>
								<SelectItem value='120+'>2+ hours</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Minimum Rating
						</label>
						<Select
							value={
								filters.minRating === "" ? "any" : filters.minRating.toString()
							}
							onValueChange={(value) =>
								onFilterChange(
									"minRating",
									value === "any" ? "" : Number(value),
								)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Any rating' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='any'>Any rating</SelectItem>
								{[0, 1, 2, 3, 4].map((rating) => (
									<SelectItem key={rating} value={String(rating)}>
										<div className='flex items-center gap-2'>
											<RatingStars count={rating} />
											<span>{rating} & above</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Sort By
						</label>
						<Select
							value={`${filters.sortBy}-${filters.sortOrder}`}
							onValueChange={handleSortChange}
						>
							<SelectTrigger>
								<SelectValue placeholder='Sort by' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='createdAt-desc'>Newest First</SelectItem>
								<SelectItem value='createdAt-asc'>Oldest First</SelectItem>
								<SelectItem value='title-asc'>Title (A-Z)</SelectItem>
								<SelectItem value='title-desc'>Title (Z-A)</SelectItem>
								<SelectItem value='rating-desc'>Highest Rated</SelectItem>
								<SelectItem value='rating-asc'>Lowest Rated</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='lg:hidden pt-4 border-t'>
						<Button
							onClick={() => setIsExpanded(false)}
							className='w-full'
							variant='default'
						>
							Apply Filters
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterSection;
