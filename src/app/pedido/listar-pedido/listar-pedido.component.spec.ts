import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarPedidoComponent } from './listar-pedido.component';
import { PedidoService } from '../../services/pedido.service';
import { UtilityService } from '../../services/utility.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CuPedidoComponent } from '../cu-pedido/cu-pedido.component';

describe('ListarPedidoComponent', () => {

  let component: ListarPedidoComponent;
  let fixture: ComponentFixture<ListarPedidoComponent>;

  let pedidoServiceMock: any;
  let utilityServiceMock: any;

  beforeEach(async () => {

    pedidoServiceMock = {
      getPedidos: jest.fn(),
      crearPedido: jest.fn(),
      editarPedido: jest.fn(),
      eliminarPedido: jest.fn()
    };

    utilityServiceMock = {
      AbrirModal: jest.fn(),
      CerrarModal: jest.fn()
    };

    pedidoServiceMock.getPedidos.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [
        ListarPedidoComponent,
        CuPedidoComponent
      ],
      imports: [FormsModule],
      providers: [
        { provide: PedidoService, useValue: pedidoServiceMock },
        { provide: UtilityService, useValue: utilityServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar pedidos', () => {

    const pedidosMock = [
      {
        IdPedido: 1,
        IdUsuario: 1,
        Fecha: new Date(),
        Total: 900000
      }
    ];

    pedidoServiceMock.getPedidos.mockReturnValue(of(pedidosMock));

    component.LoadPedidos();

    expect(component.vectorPedidos.length).toBe(1);

  });

  it('debe crear pedido', () => {

    component.isNew = true;

    component.pedidoSeleccionado = {
      IdPedido: 0,
      IdUsuario: 1,
      Fecha: new Date(),
      Total: 100000
    };

    pedidoServiceMock.crearPedido.mockReturnValue(of({}));

    component.GuardarPedido();

    expect(pedidoServiceMock.crearPedido).toHaveBeenCalled();

  });

  it('debe editar pedido', () => {

    component.isNew = false;

    component.pedidoSeleccionado = {
      IdPedido: 1,
      IdUsuario: 1,
      Fecha: new Date(),
      Total: 500000
    };

    pedidoServiceMock.editarPedido.mockReturnValue(of({}));

    component.GuardarPedido();

    expect(pedidoServiceMock.editarPedido).toHaveBeenCalled();

  });

});