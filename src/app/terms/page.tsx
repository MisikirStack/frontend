import Link from "next/link";
import { Star } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container flex h-16 items-center px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500" />
                        <span className="text-xl font-bold text-green-700 dark:text-green-500">
                            Misikir
                        </span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="container max-w-4xl px-4 py-12 md:px-6 md:py-16">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl dark:text-white">
                            Terms of Service
                        </h1>
                        <p className="text-muted-foreground">
                            Last updated: November 4, 2025
                        </p>
                    </div>

                    <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                1. Introduction
                            </h2>
                            <p className="text-muted-foreground">
                                Welcome to Misikir. These Terms of Service ("Terms") govern your use of our platform and services. By accessing or using Misikir, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                2. Use of Services
                            </h2>
                            <p className="text-muted-foreground">
                                You agree to use Misikir only for lawful purposes and in accordance with these Terms. You are responsible for all activity that occurs under your account.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                3. User Content
                            </h2>
                            <p className="text-muted-foreground">
                                Users are responsible for the content they post on Misikir, including business reviews and ratings. Content must be honest, accurate, and not violate any applicable laws or third-party rights.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                4. Intellectual Property
                            </h2>
                            <p className="text-muted-foreground">
                                All content and materials available on Misikir, including but not limited to text, graphics, logos, and software, are the property of Misikir or its licensors and are protected by intellectual property laws.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                5. Privacy
                            </h2>
                            <p className="text-muted-foreground">
                                Your use of Misikir is also governed by our{" "}
                                <Link href="/privacy" className="text-green-600 dark:text-green-500 hover:underline">
                                    Privacy Policy
                                </Link>
                                . Please review our Privacy Policy to understand our practices.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                6. Termination
                            </h2>
                            <p className="text-muted-foreground">
                                We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason, including violation of these Terms.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                7. Changes to Terms
                            </h2>
                            <p className="text-muted-foreground">
                                We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page. Your continued use of Misikir after such changes constitutes your acceptance of the new Terms.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                8. Contact Us
                            </h2>
                            <p className="text-muted-foreground">
                                If you have any questions about these Terms, please contact us through our support channels.
                            </p>
                        </section>

                        <div className="mt-8 pt-8 border-t">
                            <p className="text-sm text-muted-foreground italic">
                                Note: This is a placeholder Terms of Service document. Please consult with legal professionals to draft comprehensive terms appropriate for your jurisdiction and business needs.
                            </p>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Link
                            href="/"
                            className="text-green-600 dark:text-green-500 hover:underline"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
