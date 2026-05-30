import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { DescripcionPedidoService } from './descripcion-pedido.service';

describe('DescripcionPedidoService', () => {
  let service: DescripcionPedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = new DescripcionPedidoService(TestBed.inject(HttpClient));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
