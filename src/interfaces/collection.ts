export interface ICollection {
    id: string;
    userId?: string;
    titluColectie: string;
    descriereColectie: string;
    publica: boolean;
    createdAt: number;
    updatedAt?: number;
    deletedAt?: number;
}