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

