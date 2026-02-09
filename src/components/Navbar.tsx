import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { logout } from "@/slices/auth/authSlice";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
	const { user, isAuthenticated } = useSelector(
		(state: RootState) => state.auth,
	);
	const dispatch = useDispatch<AppDispatch>();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const getUserInitial = () => {
		return user?.name?.[0]?.toUpperCase() || "U";
	};

	return (
		<header className='border-gray-500 border-b'>
			<div className='mx-auto max-w-7xl p-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>
						<Link to={"/"}>
							<span>RecipePlatform</span>
						</Link>
					</h1>
					{isAuthenticated ? (
						<div className='relative' ref={dropdownRef}>
							<button
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className='flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-semibold text-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
								aria-label='User menu'
							>
								{getUserInitial()}
							</button>

							{dropdownOpen && (
								<div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50'>
									<div className='px-4 py-3 border-b border-gray-100'>
										<p className='text-sm font-medium text-gray-900'>
											{user?.name}
										</p>
										<p className='text-xs text-gray-500 truncate'>
											{user?.email}
										</p>
									</div>
									<div className='py-1'>
										<Link
											to='/profile'
											className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											onClick={() => setDropdownOpen(false)}
										>
											Profile
										</Link>
										<Link
											to='/my-recipes'
											className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											onClick={() => setDropdownOpen(false)}
										>
											My Recipes
										</Link>
										<Link
											to='/settings'
											className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											onClick={() => setDropdownOpen(false)}
										>
											Settings
										</Link>
									</div>
									<div className='border-t border-gray-100 py-1'>
										<button
											onClick={() => {
												dispatch(logout());
												setDropdownOpen(false);
											}}
											className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
										>
											Logout
										</button>
									</div>
								</div>
							)}
						</div>
					) : (
						<Link to='/login'>Login</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;
