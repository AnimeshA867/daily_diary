import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
    description: "Securely log in to your Krypt account.",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
