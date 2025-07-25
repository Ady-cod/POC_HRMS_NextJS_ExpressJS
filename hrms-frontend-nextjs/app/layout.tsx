import "@/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        {children}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          style={{
            width: "90%",
            maxWidth: "500px",
          }}
        />
      </body>
    </html>
  );
}
