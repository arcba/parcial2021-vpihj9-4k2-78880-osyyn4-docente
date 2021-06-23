import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  Titulo = 'Productos';
  TituloAccionABMC = {
    A: '(Alta)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; 
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Producto[] = null;
  submitted: boolean = false;
  FormRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private productosService: ProductosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      ProductoID: [0],
      ProductoNombre: [
        null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
      ],
      ProductoFechaAlta: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ],
      ProductoStock: [null, [Validators.required, Validators.pattern('^\\d{1,10}$')]],
    });
    this.Buscar();
  }

  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ProductoID: 0, ProductoNombre: null});
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
  }

  Buscar() {
    this.productosService
      .get().subscribe((res: any) => {
        this.Items = res;
      });
  }

  Grabar() {
    this.submitted = true;
    if (this.FormRegistro.invalid) {
      return;
    }

    const itemCopy = { ...this.FormRegistro.value };

    var arrFecha = itemCopy.ProductoFechaAlta.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.ProductoFechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    this.productosService.post(itemCopy).subscribe((res: any) => {
      this.Volver();
      this.modalDialogService.Alert('Registro agregado correctamente.');
      this.Buscar();
    });
    
  }

  Volver() {
    this.AccionABMC = 'L';
  }
}
