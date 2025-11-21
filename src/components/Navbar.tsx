
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Boss Timer', path: '/boss-timer' },
  { name: 'Builds', subLinks: [
    { name: 'Class & Tag', path: '/builds/class-tag' },
    { name: 'Gear', path: '/builds/gear' },
  ]},
  { name: 'Codes', path: '/codes' },
  { name: 'Settings', path: '/settings' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const activeLinkClass = 'bg-gray-800 text-white';
  const inactiveLinkClass = 'text-gray-300 hover:bg-gray-700 hover:text-white';

  const renderLink = (link: { name: string; path: string }) => (
     <NavLink
      key={link.path}
      to={link.path}
      onClick={() => setIsOpen(false)}
      className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
    >
      {link.name}
    </NavLink>
  );

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 text-white text-xl font-bold">
              Lordnine Tools
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((item) => {
                   if ('subLinks' in item) {
                    return (
                        <div key={item.name} className="relative">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                                className={`${inactiveLinkClass} px-3 py-2 rounded-md text-sm font-medium inline-flex items-center`}
                            >
                                {item.name}
                                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {openDropdown === item.name && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                                    {item.subLinks.map(subLink => (
                                        <NavLink
                                            key={subLink.path}
                                            to={subLink.path}
                                            onClick={() => setOpenDropdown(null)}
                                            className={({ isActive }) => `${isActive ? 'bg-gray-600' : ''} block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600`}
                                        >
                                            {subLink.name}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                   }
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path!}
                      className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((item) => {
                if ('subLinks' in item) {
                    return (
                        <div key={item.name}>
                            <span className="text-gray-400 block px-3 py-2 text-base font-medium">{item.name}</span>
                            <div className="pl-4">
                                {item.subLinks.map(subLink => renderLink(subLink))}
                            </div>
                        </div>
                    )
                }
                return renderLink(item as {name: string, path: string});
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
