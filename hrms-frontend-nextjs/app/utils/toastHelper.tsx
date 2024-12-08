import { toast } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

// Create a toast style variable to be used for all toasts
  const toastStyle = {
    border: "3px solid gray",
    borderRadius: "12px",
    boxShadow: "8px 8px 8px gray",
  };

// Function to show toast messages
export const showToast = (type: ToastType, title: string, messages: string[]) => {
  const formattedMessages = messages.map((message, index) => (
    <li key={index}>
      {message}
      <br />
      <br />
    </li>
  ));
  toast[type](
    <>
      <strong>{title}</strong>
      <br />
      <br />
      <ul>{formattedMessages}</ul>
    </>,
    {
      style: toastStyle,
    }
  );
};
