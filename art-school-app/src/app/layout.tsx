import NavBarWrapper from "./NavBarWrapper";
import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBarWrapper />
        {children}
      </body>
    </html>
  );
}
