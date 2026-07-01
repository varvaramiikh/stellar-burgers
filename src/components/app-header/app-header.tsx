import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

import styles from '../ui/app-header/app-header.module.css';

import { useSelector } from '../../services/store';
import { selectUser } from '../../services/userSlice';

export const AppHeader: FC = () => {
  const { pathname } = useLocation();
  const user = useSelector(selectUser);

  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients');

  const isFeedActive = pathname.startsWith('/feed');

  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={`${styles.link} ${
              isConstructorActive ? styles.link_active : ''
            }`}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>

          <NavLink
            to='/feed'
            className={`${styles.link} ${
              isFeedActive ? styles.link_active : ''
            }`}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={`${styles.link} ${
              isProfileActive ? styles.link_active : ''
            }`}
          >
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {user?.name || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
