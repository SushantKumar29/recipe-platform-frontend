import { Link } from "react-router";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { logout } from "@/slices/auth/authSlice";

const Navbar = () => {
	const { user, isAuthenticated } = useSelector(
		(state: RootState) => state.auth,
	);
	const dispatch = useDispatch<AppDispatch>();

	return (
		<header className='bg-gray-500 border-b text-white'>
			<div className='mx-auto max-w-6xl p-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>
						<Link to={"/"}>
							<span>RecipePlatform</span>
						</Link>
					</h1>
					{isAuthenticated ? (
						<div className='flex gap-4 items-center'>
							<span>{user?.name}</span>
							<Button onClick={() => dispatch(logout())}>Logout</Button>
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
