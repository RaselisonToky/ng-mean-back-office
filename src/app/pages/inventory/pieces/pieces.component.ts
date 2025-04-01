import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/ui/custom-table/custom-table.component';
import { Piece } from './model/piece.model';
import { PiecesService } from './service/pieces.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/ui/dialog/dialog.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-pieces',
  imports: [CommonModule, CustomTableComponent],
  templateUrl: './pieces.component.html',
  styleUrl: './pieces.component.css',
})
export class PiecesComponent implements OnInit {
  height = '400px';
  tableHeaders = ['Nom', 'Ref', 'Prix', 'Quantité', 'Qte Minimal','Action'];
  pieces: Piece[] = [];
  constructor(private pieceService: PiecesService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.loadPieces();
  }

  loadPieces(): void {
    this.pieceService.findAll().subscribe({
      next: (data) => {
        this.pieces = data.data;
        console.log('Données récupérées:', data);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      },
    });
  }

  openDialog(piece?: Piece): void {
    const dialogRef = this.dialog.open(DialogComponent, {

      width: '700px',
      data: {
        title: piece ? 'Modifier la pièce' : 'Ajouter une pièce',
        entity: piece || {},
        customClass: 'piece-dialog-form',
        formConfig: [
          {
            name: 'name',
            label: 'Nom',
            validators: Validators.required,
            errorMessage: 'Le nom est obligatoire'
          },
          {
            name: 'reference',
            label: 'Référence',
            validators: Validators.required,
            errorMessage: 'La référence est obligatoire'
          },
          {
            name: 'unit_price',
            label: 'Prix Unitaire',
            type: 'number',
            validators: Validators.required,
            errorMessage: 'Le prix unitaire est obligatoire'
          },
          {
            name: 'stock_quantity',
            label: 'Quantité',
            type: 'number',
            validators: Validators.required,
            errorMessage: 'La quantité est obligatoire'
          },
          {
            name: 'alert_threshold',
            label: "Seuil d'alerte",
            type: 'number',
            validators: Validators.required,
            errorMessage: "Le seuil d'alerte est obligatoire"
          }
        ]
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (piece) {
          // Mise à jour d'une pièce existante
          this.pieceService.update(piece._id, result).subscribe({
            next: () => {
              console.log('Pièce mise à jour avec succès');
              this.loadPieces(); // Recharger les données
            },
            error: (error) => {
              console.error('Erreur lors de la mise à jour:', error);
            }
          });
        } else {
          // Création d'une nouvelle pièce
          this.pieceService.create(result).subscribe({
            next: () => {
              console.log('Pièce créée avec succès');
              this.loadPieces(); // Recharger les données
            },
            error: (error) => {
              console.error('Erreur lors de la création:', error);
            }
          });
        }
      }
    });
  }

  deletePiece(piece: Piece): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la pièce ${piece.name}?`)) {
      this.pieceService.delete(piece._id).subscribe({
        next: () => {
          console.log('Pièce supprimée avec succès');
          this.loadPieces(); // Recharger les données
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

}
