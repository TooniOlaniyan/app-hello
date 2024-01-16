import { bottombarLinks } from '@/constants';
import React from 'react'
import { Link , useLocation } from 'react-router-dom'

const Bottombar = () => {
  const {pathname} = useLocation()
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={link.label}
            className={`${
              isActive && "bg-primary-500 rounded-[10]"
            } flex-center flex-col gap-1 p-2 transition`}
            to={link.route}
          >
            <img
              className={`${isActive && "invert-white"}`}
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
            />
            <p className='tiny-medium text-light-2'>{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
}

export default Bottombar