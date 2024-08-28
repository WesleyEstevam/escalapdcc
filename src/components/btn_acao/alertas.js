import Swal from "sweetalert2";

export function alerta() {
  Swal.fire("Bom trabalho!", "Registro atualizado com sucesso!", "success");
}

export function alertaCadastro() {
  Swal.fire("Bom trabalho!", "Cadastro realizado com sucesso!", "success");
}

export function alertaEdicao() {
  Swal.fire("Bom trabalho!", "Escala atualizada com sucesso!", "success");
}

export function alertaCopy() {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: "Escala copiada com sucesso!",
  });
}

export function erroLogin() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "error",
    title: "Falha ao realizar login",
  });
}
