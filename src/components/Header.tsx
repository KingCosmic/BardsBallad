import MenuButton from "./MenuButton"

type HeaderProps = {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <nav className='bg-blue-50 dark:bg-neutral-950 sticky w-full z-20 top-0 start-0 border-b border-neutral-200 dark:border-neutral-700'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <div className='flex'>
          <MenuButton />

          <a className='flex items-center space-x-3 rtl:space-x-reverse ml-4'>
            <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>{title}</span>
          </a>
        </div>

        <div className='items-center justify-between hidden w-full md:flex md:w-auto md:order-1' id='navbar-sticky'>
          <ul className='flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
            {/* <li>
              <a href='#' className='block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' aria-current='page'>Home</a>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header