import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden w-full">
      <Header />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
};
