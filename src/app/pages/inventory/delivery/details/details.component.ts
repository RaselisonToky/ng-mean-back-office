import { Component, Input, Output } from '@angular/core';
import { PiecesService } from '../../pieces/service/pieces.service';
import { Piece } from '../../pieces/model/piece.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  prixUnitaire: number = 0;
  quantites: number = 0;
  selectedPieceId: string = '';
  @Input() pieces: Piece[] = [];
  filteredPieces: Piece[] = [];
  selectedPiece = '';
  details: {
    _id: string;
    pieceId: string;
    piece: Piece;
    prixUnitaire: number;
    quantite: number;
    total: number;
  }[] = [];

  addDetail() {
    console.log(this.selectedPieceId);
    const newDetail = {
      _id: this.createDetailsId(),
      pieceId: this.selectedPieceId,
      piece: this.pieces.find(piece => piece._id === this.selectedPieceId) || {} as Piece,
      prixUnitaire: this.prixUnitaire,
      quantite: this.quantites,
      total: this.prixUnitaire * this.quantites
    };
    this.details.push(newDetail);
    this.prixUnitaire = 0;
    this.quantites = 0;
  }

  onSelectedPieceChange(event: any) {
    this.selectedPieceId = event.target.value;
  }

  calculerTotal() {
    return this.formatPrice(this.details.reduce((total, detail) => {
      return total + detail.prixUnitaire * detail.quantite;
    }, 0));
  }


  formatPrice(price: number): string {
    return price.toLocaleString('fr-MG', {
      style: 'decimal', // Utiliser 'decimal' au lieu de 'currency' pour éviter "Ar"
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' Ariary'; // Ajout manuel du texte "Ariary"
  }

  createDetailsId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Generate a random number between 000 and 999
    return `dlv_${year}${month}${day}${randomNumber}`;
  }

  filterPieces() {
    this.filteredPieces = this.pieces.filter(piece =>
      piece.name.toLowerCase().includes(this.selectedPiece.toLowerCase())
    );
  }

  onPieceSelectedChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedPieceId = target.value;
    console.log("Pièce sélectionnée:", this.selectedPieceId);
  }

  editDetail(detail: any) {
    this.selectedPieceId = detail.pieceId;
    this.prixUnitaire = detail.prixUnitaire;
    this.quantites = detail.quantite;

    // Supprimer temporairement l'élément pour le modifier ensuite
    this.details = this.details.filter(d => d._id !== detail._id);
  }

  removeDetail(detailId: string) {
    this.details = this.details.filter(detail => detail._id !== detailId);
  }

}
