import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  modalRef?: BsModalRef;
  message: string = '';
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public larguraImg: number = 100;
  public margemImg: number = 2;
  public exibirImg: boolean = true;

  private filtroListado: string = '';
  public get filtroLista(): string {
    return this.filtroListado;
  }
  public set filtroLista(value: string) {
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }
  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (ev: { tema: string; local: string }) =>
        ev.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        ev.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(private eventoService: EventoService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService
  ) {}

  public ngOnInit(): void {
    this.spinnerService.show();
    this.getEventos();
  }

  public mostrarImg(): void {
    this.exibirImg = !this.exibirImg;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (response: Evento[]) => {
        this.eventos = response;
        this.eventosFiltrados = this.eventos;
      },
      error: (error:any) => {
        this.spinnerService.hide();
        this.toastrService.error('Erro ao carregar os Eventos', 'Error!')
      },
      complete: () => this.spinnerService.hide()
    });
  }

  openModal(template: TemplateRef<any>): void
  {
    this.modalRef = this.modalService.show(template, {class: "modal-sm"});
  }

  confirm(): void {
    this.modalRef?.hide();
    this.toastrService.success('Evento excluído!', 'toastr funcionando');
  }

  decline(): void {
    this.modalRef?.hide();
    this.toastrService.success('Evento não deletado!', 'toastr funcionando');
  }
}
