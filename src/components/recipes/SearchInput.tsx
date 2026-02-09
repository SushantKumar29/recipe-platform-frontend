import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface SearchInputProps {
	onSearch: (searchTerm: string) => void;
	placeholder?: string;
	value: string;
}

const SearchInput = ({
	onSearch,
	placeholder = "Search recipes...",
	value,
}: SearchInputProps) => {
	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setLocalValue(newValue);
		onSearch(newValue);
	};

	const handleClear = () => {
		setLocalValue("");
		onSearch("");
	};

	return (
		<div className='relative'>
			<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
			<Input
				placeholder={placeholder}
				value={localValue}
				onChange={handleChange}
				className='pl-10 pr-10'
			/>
			{localValue && (
				<button
					onClick={handleClear}
					className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
				>
					<X className='w-4 h-4' />
				</button>
			)}
		</div>
	);
};

export default SearchInput;
