import "./globals.css";

export const metadata = {
  title: "KINETIC | The Kinetic Altruist",
  description:
    "Elevate your game into a vehicle for change. Every swing fuels global philanthropy in a high-stakes, win-win ecosystem.",
  keywords: ["golf", "charity", "subscription", "draw", "philanthropy", "kinetic"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface font-body text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
