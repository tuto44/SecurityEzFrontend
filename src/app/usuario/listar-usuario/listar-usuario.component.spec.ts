import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarUsuarioComponent } from './listar-usuario.component';
import { UsuarioService } from '../../services/usuario.service';
import { UtilityService } from '../../services/utility.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CuUsuarioComponent } from '../cu-usuario/cu-usuario.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'
describe('ListarUsuarioComponent', () => {

  let component: ListarUsuarioComponent;
  let fixture: ComponentFixture<ListarUsuarioComponent>;

  let usuarioServiceMock: any;
  let utilityServiceMock: any;

  beforeEach(async () => {

    usuarioServiceMock = {
      getUsuarios: jest.fn(),
      crearUsuario: jest.fn(),
      editarUsuario: jest.fn(),
      eliminarUsuario: jest.fn()
    };

    utilityServiceMock = {
      AbrirModal: jest.fn(),
      CerrarModal: jest.fn()
    };

    usuarioServiceMock.getUsuarios.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [
        ListarUsuarioComponent,
        CuUsuarioComponent
      ],
      imports: [FormsModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceMock },
        { provide: UtilityService, useValue: utilityServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar usuarios correctamente', () => {

    const usuariosMock = [
      {
        IdUsuario: 1,
        Nombre: 'Ricardo',
        Direccion: 'Medellín',
        Telefono: 123456,
        Usuario: 'rrendon',
        Contrasena: '123',
        TipoUsuario: 'Administrador'
      }
    ];

    usuarioServiceMock.getUsuarios.mockReturnValue(of(usuariosMock));

    component.LoadUsuarios();

    expect(component.vectorUsuarios.length).toBe(1);
    expect(component.isLoading).toBeFalsy();

  });

  it('debe abrir modal para nuevo usuario', () => {

    component.NuevoUsuario();

    expect(component.isNew).toBeTruthy();
    expect(component.usuarioSelecionado).toBeTruthy();
    expect(utilityServiceMock.AbrirModal).toHaveBeenCalled();

  });

  it('debe abrir modal para editar usuario', () => {

    const usuarioMock: any = {
      IdUsuario: 1,
      Nombre: 'Ricardo',
      Direccion: 'Medellín',
      Telefono: 123456,
      Usuario: 'rrendon',
      Contrasena: '123',
      TipoUsuario: 'Administrador'
    };

    component.EditarUsuario(usuarioMock);

    expect(component.usuarioSelecionado).toEqual(usuarioMock);
    expect(component.isNew).toBeFalsy();

  });

  it('debe crear usuario correctamente', () => {

    component.isNew = true;

    component.usuarioSelecionado = {
      IdUsuario: 0,
      Nombre: 'Nuevo',
      Direccion: 'Dirección',
      Telefono: 999,
      Usuario: 'nuevo',
      Contrasena: '123',
      TipoUsuario: 'Cliente'
    };

    usuarioServiceMock.crearUsuario.mockReturnValue(of({}));

    component.GuardarUsuario();

    expect(usuarioServiceMock.crearUsuario).toHaveBeenCalled();
    expect(utilityServiceMock.CerrarModal).toHaveBeenCalled();

  });

  it('debe editar usuario correctamente', () => {

    component.isNew = false;

    component.usuarioSelecionado = {
      IdUsuario: 1,
      Nombre: 'Editado',
      Direccion: 'Dirección',
      Telefono: 999,
      Usuario: 'editado',
      Contrasena: '123',
      TipoUsuario: 'Administrador'
    };

    usuarioServiceMock.editarUsuario.mockReturnValue(of({}));

    component.GuardarUsuario();

    expect(usuarioServiceMock.editarUsuario).toHaveBeenCalled();
    expect(utilityServiceMock.CerrarModal).toHaveBeenCalled();

  });

  it('debe manejar error al crear usuario', () => {

    component.isNew = true;

    component.usuarioSelecionado = {
      IdUsuario: 0,
      Nombre: 'Error',
      Direccion: '',
      Telefono: 0,
      Usuario: '',
      Contrasena: '',
      TipoUsuario: 'Cliente'
    };

    usuarioServiceMock.crearUsuario.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.GuardarUsuario();

    expect(usuarioServiceMock.crearUsuario).toHaveBeenCalled();

  });

});