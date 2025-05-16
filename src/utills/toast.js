import { useToast } from 'vue-toastification';
개;

const toast = useToast();

export function showErrorToast(message) {
  toast.error(message, {
    timeout: 3000,
    position: 'top-right',
  });
}

export function showSuccessToast(message) {
  toast.success(message, {
    timeout: 3000,
    position: 'top-right',
  });
}
