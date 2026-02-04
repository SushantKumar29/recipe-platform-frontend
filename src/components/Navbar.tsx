import { PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";

const Navbar = () => {
	return (
		<header className='bg-gray-500 border-b text-white'>
			<div className='mx-auto max-w-6xl p-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>
						<Link to={"/"}>
							<span>RecipePlatform</span>
						</Link>
					</h1>
					<div className='flex items-center gap-4'>
						<Link to={"/new-recipe"} className='btn btn-primary'>
							<Button className='cursor-pointer'>
								<PlusIcon className='size-5' />
								<span>New Recipe</span>
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
