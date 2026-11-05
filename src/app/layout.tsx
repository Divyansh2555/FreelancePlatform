import "./globals.css";
import { ChatProvider } from "./providers/ChatProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}