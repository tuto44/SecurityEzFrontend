export interface Usuario {
    IdUsuario: number;
    Nombre: string;
    Direccion: string;
    Telefono: number;
    Usuario: string;
    Contrasena:string;
    TipoUsuario: "Administrador"|"Cliente";

}