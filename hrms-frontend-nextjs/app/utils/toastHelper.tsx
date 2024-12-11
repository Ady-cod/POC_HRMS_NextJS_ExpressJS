import { toast } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

// Create a toast style variable to be used for all toasts
  const toastStyle: React.CSSProperties = {
    border: "3px solid gray",
    borderRadius: "12px",
    boxShadow: "12px 12px 4px gray",
    fontSize: "1.2rem",
    textAlign: "center",
    maxHeight: "90dvh",
    overflow: "auto",
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
      style: {...toastStyle, borderColor: type === "success" ? "green" : "red" },
    }
  );
};
