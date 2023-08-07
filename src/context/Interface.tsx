export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  created: string;
  url: string;
}

export interface PlanetResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: Planet[];
}

export interface ContextProps {
  planets: PlanetResult;
  currentPage: number;
  handleClick: (currentPage: number) => void;
  isLoading: boolean;
  handleDetailPlanet: (url: string) => void;
  detailPlanet: Planet | null;
  closeModal: () => void;
  isModalOpen: boolean;
  convertDateTime: (dateString: string) => string;
}
