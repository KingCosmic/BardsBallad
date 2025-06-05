import { NavLink } from 'react-router';
import { deleteSystem, renameSystem } from '@storage/methods/systems';
import { openModal } from '@state/modals';
import { Theme } from '@state/themes';

type Props = {
  theme: Theme
}

const ThemeCard: React.FC<Props> = ({ theme }) => {
  return (
    <div
      key={theme.name}
      className="relative flex flex-col max-w-96 p-4 tranasition-all duration-200 bg-white border rounded-xl hover:shadow-lg dark:bg-neutral-800 dark:border-neutral-700 hover:transform hover:scale-[1.02]"
    >
      <NavLink
        to={`systems/${theme.name}`}
        className="flex items-start space-x-4"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-brand-600 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-white">{theme.name[0]}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h5 className="text-xl font-semibold text-neutral-900 truncate dark:text-white">
            {theme.name}
          </h5>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Version {0}
          </p>
        </div>
      </NavLink>
    </div>
  );
};

export default ThemeCard
