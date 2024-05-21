export type RecipeWithReactionsDto = {
  id: string,
  titluReteta: string,
  dificultate: string,
  ingrediente: Array<string>,
  instructiuni: string,
  calePoza: string,
  caleVideo: string,
  participaconcurs: boolean,
  deletedat: number;
  createdat: number;
  updatedat: number;
  colectie: string;
  reactii: ReactieDto[];
  comentarii: ComentariuDto[];
};

export type ReactieDto = {
  id: string,
  reactie: string,
  deletedat: number;
  createdat: number;
  updatedat: number;
  utilizator: {
    id: string;
  }
};

export type ComentariuDto = {
  id: string;
  text: string;
  dataPostare: number;
  deletedat: number;
  createdat: number;
  updatedat: number;
};

