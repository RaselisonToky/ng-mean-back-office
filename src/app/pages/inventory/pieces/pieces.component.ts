import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/ui/custom-table/custom-table.component';
import { Piece } from './model/piece.model';
import { PiecesService } from './service/pieces.service';

@Component({
  selector: 'app-pieces',
  imports: [CommonModule, CustomTableComponent],
  templateUrl: './pieces.component.html',
  styleUrl: './pieces.component.css',
})
export class PiecesComponent implements OnInit {
  height = '400px';
  tableHeaders = ['Nom', 'Ref', 'Prix', 'Quantité', 'Qte Minimal'];
  pieces: Piece[] = [];
  constructor(private pieceService: PiecesService) { }
  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
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
}
