	// import { useState } from 'react'
	import { NavLink } from 'react-router-dom'
	// import { MenuIcon, XIcon } from 'lucide-react'

	interface NavLinkType {
	    name: string
	    path: string
	    }

	const navLinks: NavLinkType[] = [
	{ name: 'Home', path: '/' },
	{ name: 'About', path: '/about' }
	]


	export const Navbar = () => {
	    // State to manage the navbar's visibility
	    // const [nav, setNav] = useState(false);

	    // Toggle function to handle the navbar's display
	    // const handleNav = () => {
	    //     setNav(!nav);
	    // };

	    return (
	        	//navbar.tsx html code
                <div className='pb-20'>
                    <header className='bg-black fixed w-full px-8 shadow-sm shadow-neutral-500 h-[--navbar-height] flex items-center'>
                        {/* Logo */}
                        <h1 className='w-full text-3xl font-bold text-[#FFFF]'>TRACKER</h1>

                        {/* Desktop Navigation */}
                        <ul className='hidden md:flex'>
                        {navLinks.map((link) => (
                            <NavLink key={link.name} to={link.path} className='text-secondary cursor-default'>
                            <li
                            className='p-4  rounded-xl m-2  duration-300 '>

                                {link.name}

                            </li>
                            </NavLink>
                            ))}
                        </ul>

                        {/* Mobile Navigation Icon */}
                        {/* <div onClick={handleNav} className='block md:hidden'>
                            {nav ? <XIcon className='size-6 text-secondary' /> : <MenuIcon className='size-6 text-secondary' />}
                        </div> */}

                        {/* Mobile Navigation Menu */}
                        {/* <ul
                            className={
                            nav
                                ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 overflow-y-auto overflow-x-hidden'
                                : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                            }
                        > */}
                            {/* Mobile Logo */}
                            {/* <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>TYPER.</h1> */}

                            {/* Mobile Navigation Items */}
                            {/* {navLinks.map((link) => (
                            <NavLink key={link.name} to={link.path} className='text-secondary'>
                                <li
                                className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'
                                >

                                    {link.name}

                                </li>
                            </NavLink>
                            ))}
                        </ul> */}
                    </header>
                </div>
	    )
	}