
import { Link, NavLink , useLocation } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';
import { Button } from '../ui/button';
import { useSignOutAccountMutation } from '@/lib/react-query/queriesAndMutations';

const LeftSidebar = () => {
    const {mutate:signOutAccount} = useSignOutAccountMutation()
    const {pathname} = useLocation()
    const {user} = useUserContext()
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="Logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">{user.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  className="flex gap-4 items-center p-4"
                  to={link.route}
                >
                  <img
                    className="group-hover:invert-white"
                    src={link.imgURL}
                    alt={link.label}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOutAccount}
      >
        <img src="/assets/icons/logout.svg" />
        <p className='small-medium lg:base-medium'>Log out</p>
      </Button>
    </nav>
  );
}

export default LeftSidebar