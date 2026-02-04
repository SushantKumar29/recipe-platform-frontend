import { Route, Routes } from "react-router";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import RecipePage from "@/pages/RecipePage";

const App = () => {
	return (
		<div className='min-h-screen flex flex-col bg-gray-300'>
			{/* <div className='absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]' /> */}
			<Navbar />
			<main className='flex-1'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/recipes/:id' element={<RecipePage />} />
				</Routes>
			</main>

			<Footer />
		</div>
	);
};

export default App;
