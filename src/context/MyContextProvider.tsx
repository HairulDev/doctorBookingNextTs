import React, { createContext, FC, useEffect, useState } from 'react';
import Axios from 'axios';
import { Planet, PlanetResult, ContextProps } from './Interface';

const API = Axios.create({ baseURL: 'http://localhost:3000' });

const defaultContext: ContextProps = {
  planets: {
    count: 0,
    next: null,
    previous: null,
    results: []
  },
  currentPage: 1,
  handleClick: () => {},
  isLoading: false,
  handleDetailPlanet: () => {},
  detailPlanet: null,
  closeModal: () => {},
  isModalOpen: false,
  convertDateTime: () => ''
};

export const MyContext = createContext(defaultContext);

const MyContextProvider: FC = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detailPlanet, setDetailPlanet] = useState<Planet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [planets, setPlanets] = useState<PlanetResult>(defaultContext.planets);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const { data } = await API.get<PlanetResult>(`/doctor`);
  //     setPlanets(data);
  //     setIsLoading(false);
  //   };
  //   fetchData();
  // }, [currentPage]);

  const handleDetailPlanet = async (url: string) => {
    setIsLoading(true);
    const { data } = await API.get<Planet>(url);
    setDetailPlanet(data);
    setIsLoading(false);
    setIsModalOpen(true);
  };

  const convertDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleClick = (page: number) => setCurrentPage(page);

  const closeModal = () => setIsModalOpen(false);

  const contextValue: ContextProps = {
    planets,
    currentPage,
    handleClick,
    isLoading,
    handleDetailPlanet,
    detailPlanet,
    closeModal,
    isModalOpen,
    convertDateTime
  };

  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};

export default MyContextProvider;
