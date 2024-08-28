import Swal from 'sweetalert2';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button } from '@mui/material';

export const DeletarItem = ({ onDelete }) => {

  const handleDelete = () => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Apagar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Excluído!',
          'Seu registro foi excluído com sucesso.',
          'success',
          onDelete()
        )
      }
    })
  }
  return (
    <div>
      {/* Renderização do botão ou link que dispara o modal */}
      <Button
        color="error"
        variant="contained"
        onClick={handleDelete}
      >
        <DeleteForeverIcon />
      </Button>
    </div>
  );
};

