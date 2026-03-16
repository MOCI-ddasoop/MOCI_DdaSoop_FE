import Swal from "sweetalert2";

const baseConfig = ({
  red = false,
  title = "",
}: {
  red?: boolean;
  logo?: boolean;
  title?: string;
}) => ({
  confirmButtonColor: red ? "#eb5353" : "#3085d6",
  cancelButtonColor: red ? "#99a1af " : "#99a1af ",
  denyButtonColor: red ? "#eb5353 " : "#eb5353 ",
  width: "320px",
  padding: "10px",
  title: `<div class="flex-center flex-col gap-2"><img src="/logo.svg" class="w-12"></img><p>${title}</p></div>`,
});

export const Alert = ({
  title = "",
  text,
  allowOutsideClick = true,
  didOpen,
  timer,
  red,
}: {
  title?: string;
  text?: string;
  allowOutsideClick?: boolean;
  didOpen?: () => void;
  timer?: number;
  red?: boolean;
}) =>
  Swal.fire({
    ...baseConfig({ red, title }),
    html: text,
    allowOutsideClick,
    didOpen,
    timer,
    confirmButtonText: "확인",
    customClass: {
      popup: red ? "red-loader" : "",
    },
  });

export const UpdateAlert = ({
  title = "",
  text,
  red,
}: {
  title?: string;
  text?: string;
  red?: boolean;
}) =>
  Swal.update({
    ...baseConfig({ red, title }),
    html: text,
  });

export const ConfirmAlert = async ({
  title = "",
  text,
  showCancelButton = true,
  showConfirmButton = true,
  showDenyButton = false,
  confirmButtonText = "확인",
  cancelButtonText = "취소",
  denyButtonText = "취소",
  red,
}: {
  title?: string;
  text?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  showDenyButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  denyButtonText?: string;
  red?: boolean;
}) =>
  Swal.fire({
    ...baseConfig({ red, title }),
    html: text,
    showCancelButton,
    showConfirmButton,
    showDenyButton,
    confirmButtonText,
    cancelButtonText,
    denyButtonText,
  });

export const TextInputAlert = ({
  title = "제목",
  inputPlaceholder,
  showCancelButton = true,
  showConfirmButton = true,
  confirmButtonText = "확인",
  cancelButtonText = "취소",
  validMessage,
  red,
}: {
  title?: string;
  inputPlaceholder?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  validMessage?: string;
  red?: boolean;
}) =>
  Swal.fire({
    ...baseConfig({ red, title }),
    input: "textarea",
    width: "500px",
    inputPlaceholder,
    inputAttributes: { maxLength: "200" },
    showCancelButton,
    showConfirmButton,
    confirmButtonText,
    cancelButtonText,
    inputValidator: (value) => {
      if (!value || !value.trim()) return validMessage;
    },
  });
