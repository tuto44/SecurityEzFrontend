import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarProductoComponent } from './listar-producto.component';
import { ProductoService } from '../../services/producto.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { UtilityService } from '../../services/utility.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CuProductoComponent } from '../cu-producto/cu-producto.component';

describe('ListarProductoComponent', () => {

  let component: ListarProductoComponent;
  let fixture: ComponentFixture<ListarProductoComponent>;

  let productoServiceMock: any;
  let utilityServiceMock: any;

  beforeEach(async () => {

    productoServiceMock = {
      getProductos: jest.fn(),
      crearProducto: jest.fn(),
      editarProducto: jest.fn(),
      eliminarProducto: jest.fn()
    };

    utilityServiceMock = {
      AbrirModal: jest.fn(),
      CerrarModal: jest.fn()
    };

    productoServiceMock.getProductos.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [
        ListarProductoComponent,
        CuProductoComponent
      ],
      imports: [FormsModule],
      providers: [
        { provide: ProductoService, useValue: productoServiceMock },
        { provide: UtilityService, useValue: utilityServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar productos correctamente', () => {

    const productosMock = [
      {
        IdProducto: 1,
        Nombre: 'Cámara',
        Precio: 500000,
        Stock: 10,
        Imagen: 'img.jpg'
      }
    ];

    productoServiceMock.getProductos.mockReturnValue(of(productosMock));

    component.LoadProductos();

    expect(component.vectorProductos.length).toBe(1);
    expect(component.isLoading).toBeFalsy();

  });

  it('debe abrir modal para nuevo producto', () => {

    component.NuevoProducto();

    expect(component.isNew).toBeTruthy();
    expect(component.productoSeleccionado).toBeTruthy();
    expect(utilityServiceMock.AbrirModal).toHaveBeenCalled();

  });

  it('debe crear producto correctamente', () => {

    component.isNew = true;

    component.productoSeleccionado = {
      IdProducto: 0,
      Nombre: 'Sensor',
      Precio: 100000,
      Stock: 5,
      Imagen: 'sensor.jpg',
      Descripcion: 'Sensor movimiento',
      IdCategoria: 1,
      IdProveedor: 1
    };

    productoServiceMock.crearProducto.mockReturnValue(of({}));

    component.GuardarProducto();

    expect(productoServiceMock.crearProducto).toHaveBeenCalled();
    expect(utilityServiceMock.CerrarModal).toHaveBeenCalled();

  });

  it('debe editar producto correctamente', () => {

    component.isNew = false;

    component.productoSeleccionado = {
      IdProducto: 1,
      Nombre: 'Producto Editado',
      Precio: 90000,
      Stock: 8,
      Imagen: 'edit.jpg',
      Descripcion: 'Editado',
      IdCategoria: 1,
      IdProveedor: 1
    };

    productoServiceMock.editarProducto.mockReturnValue(of({}));

    component.GuardarProducto();

    expect(productoServiceMock.editarProducto).toHaveBeenCalled();

  });

  it('debe manejar error al crear producto', () => {

    component.isNew = true;

    component.productoSeleccionado = {
      IdProducto: 0,
      Nombre: '',
      Precio: 0,
      Stock: 0,
      Imagen: '',
      Descripcion: '',
      IdCategoria: 0,
      IdProveedor: 0
    };

    productoServiceMock.crearProducto.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.GuardarProducto();

    expect(productoServiceMock.crearProducto).toHaveBeenCalled();

  });

});