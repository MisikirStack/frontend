import Link from "next/link";
import { Star } from "lucide-react";

export default function PrivacyPage() {
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
                            Privacy Policy
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
                                Misikir ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                2. Information We Collect
                            </h2>
                            <p className="text-muted-foreground">
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Account information (name, email address, phone number)</li>
                                <li>Profile information</li>
                                <li>Business reviews and ratings</li>
                                <li>Communications with us</li>
                                <li>Usage data and analytics</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                3. How We Use Your Information
                            </h2>
                            <p className="text-muted-foreground">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process your transactions</li>
                                <li>Send you technical notices and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Detect and prevent fraud and abuse</li>
                                <li>Analyze usage patterns and trends</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                4. Information Sharing
                            </h2>
                            <p className="text-muted-foreground">
                                We may share your information in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>With your consent</li>
                                <li>With service providers who assist in our operations</li>
                                <li>To comply with legal obligations</li>
                                <li>To protect our rights and prevent fraud</li>
                                <li>In connection with a business transfer or merger</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                5. Data Security
                            </h2>
                            <p className="text-muted-foreground">
                                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                6. Your Rights
                            </h2>
                            <p className="text-muted-foreground">
                                Depending on your location, you may have certain rights regarding your personal information, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Access to your personal information</li>
                                <li>Correction of inaccurate data</li>
                                <li>Deletion of your data</li>
                                <li>Objection to processing</li>
                                <li>Data portability</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                7. Cookies and Tracking
                            </h2>
                            <p className="text-muted-foreground">
                                We use cookies and similar tracking technologies to collect information about your browsing activities and to provide personalized content and advertisements.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                8. Changes to This Policy
                            </h2>
                            <p className="text-muted-foreground">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold dark:text-white">
                                9. Contact Us
                            </h2>
                            <p className="text-muted-foreground">
                                If you have any questions about this Privacy Policy, please contact us through our support channels.
                            </p>
                        </section>

                        <div className="mt-8 pt-8 border-t">
                            <p className="text-sm text-muted-foreground italic">
                                Note: This is a placeholder Privacy Policy document. Please consult with legal professionals to draft a comprehensive privacy policy appropriate for your jurisdiction and business needs.
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
