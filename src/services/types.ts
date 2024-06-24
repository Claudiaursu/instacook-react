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
  utilizator: {
    id: string;
    username: string;
    pozaProfil: string;
  }
  dataPostare: number;
  deletedat: number;
  createdat: number;
  updatedat: number;
};

export type RecipeProps = {
  titluReteta: string,
  dificultate: string,
  instructiuni: string,
  ingrediente: Array<string>,
  calePoza?: string,
  colectie?: object
}

export type RecipeDto = {
  id: string,
  titluReteta: string,
  dificultate: string,
  ingrediente: Array<string>,
  instructiuni: string,
  calePoza: string,
  caleVideo: string,
  participaConcurs: boolean,
  deletedAt: number;
  createdAt: number;
  updatedAt: number;
  colectie: {
    id?: string
    utilizator?: string
  }
};

export type RecipeFeedDto = {
  id: string,
  titlu_reteta: string,
  dificultate: string,
  cale_poza: string,
  created_at: number;
  username: string;
  poza_profil: string;
  nr_reactii: string;
  nr_comentarii: string;
};

export type RecipeSummaryDto = {
  id: string,
  titlureteta: string,
  dificultate: string,
  ingrediente: Array<string>,
  instructiuni: string,
  calepoza: string,
  calevideo: string,
  participaconcurs: boolean,
  deletedat: number;
  createdat: number;
  updatedat: number;
  colectie: string;
  reactii: string;
  comentarii: string;
};
