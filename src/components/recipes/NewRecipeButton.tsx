import { Link } from 'react-router';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

const NewRecipeButton = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <Link to={'/new-recipe'}>
            <Button className="cursor-pointer  bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors">
              <span>New Recipe</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NewRecipeButton;
