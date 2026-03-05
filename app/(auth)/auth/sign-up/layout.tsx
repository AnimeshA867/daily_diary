import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create a Krypt account to start your secure journaling journey.",
};

export default function SignUpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
