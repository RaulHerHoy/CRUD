export class Usuario {
  _id?: string;
  nombre: string = "";
  email: string = "";
  password?: string;

  // plan del usuario comprador
  tipo: "normal" | "premium" | "vip" = "normal";

  // permisos / perfil
  rol: "buyer" | "admin" = "buyer";
}