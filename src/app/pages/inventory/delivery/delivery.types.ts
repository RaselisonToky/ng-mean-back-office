import { Piece } from "../pieces/model/piece.model";

export interface DeliveryGeneralFormData {
    bonLivraison: string;
    dateLivraison: string;
    livreur: string;
    observation?: string
}
export interface DeliveryFormDataDto {
    general: DeliveryGeneralFormData;
    details: {
        produit: string;
        quantite: number;
        prixUnitaire: number;
    }[]
}


export interface DeliveryDetail {
    _id: string;
    pieceId: string;
    piece: Piece;
    prixUnitaire: number;
    quantite: number;
    total: number;
}

export interface Delivery {
    _id: string;
    bonLivraison: string;
    livreur: string;
    ticketSuivie:string;
    fournisseur: string;
    dateLivraison: string;
}