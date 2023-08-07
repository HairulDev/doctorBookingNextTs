import React from 'react';
import styles from '../styles/Home.module.css';
import MainStyled from '@pages/styled';

const Loader: React.FC = () => (
  <div className={styles.container}>
    <MainStyled>
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700" />
      </div>
    </MainStyled>
  </div>
);

export default Loader;
