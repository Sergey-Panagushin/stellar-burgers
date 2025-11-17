import React, { FC } from 'react';
import styles from './app-header.module.css';
import { Link, useLocation } from 'react-router-dom';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive =
      location.pathname === path || location.pathname.startsWith(path + '/');

    return `${styles.link} ${isActive ? styles.link_active : ''}`;
  };

  const getIconType = (path: string) => {
    const isActive =
      location.pathname === path || location.pathname.startsWith(path + '/');

    return isActive ? 'primary' : 'secondary';
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link to='/' className={getLinkClass('/')}>
            <BurgerIcon type={getIconType('/')} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>

          <Link to='/feed' className={getLinkClass('/feed')}>
            <ListIcon type={getIconType('/feed')} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>

        <div className={styles.logo}>
          <Logo className='' />
        </div>

        <div className={styles.link_position_last}>
          <Link to='/profile' className={getLinkClass('/profile')}>
            <ProfileIcon type={getIconType('/profile')} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
