import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutComponent';

const Menu = () => {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">BakeSmart</span>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
        <Link to="/recipes" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
            Receitas
          </Link>
          <Link to="/ingredients" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
            Ingredientes
          </Link>
          {/* <Link to={`/profile/${id}`} className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
            Gerenciar Perfil
          </Link> */}
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Menu;
