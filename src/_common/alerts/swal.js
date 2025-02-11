import Swal from 'sweetalert2'

let TIMER = 2000

export const Notify = (text, type, timer = TIMER) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,

    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })

  Toast.fire({
    icon: type,
    title: text,
  })
}

export const NotifySuccess = (text = 'Success', type = 'success', timer) => {
  Notify(text, type, timer)
}

export const NotifyError = (text = 'Something went wrong', type = 'error') => {
  Notify(text, type)
}
