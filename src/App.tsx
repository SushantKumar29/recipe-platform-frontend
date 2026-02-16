import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppRoutes from "@/router/AppRoutes";
import RateLimitedUI from "@/components/RateLimitedUI";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store";

const App = () => {
	const { isRateLimited } = useSelector((state: RootState) => state.recipes);
	return (
		<div className='min-h-screen flex flex-col'>
			<Navbar />

			<main className='flex-1'>
				<div className='h-full'>
					{(isRateLimited && <RateLimitedUI />) || <AppRoutes />}
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default App;
