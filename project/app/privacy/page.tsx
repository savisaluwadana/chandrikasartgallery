import { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

export const metadata: Metadata = {
    title: 'Privacy Policy - Chandrika Maelge Art',
    description: 'Privacy Policy for Chandrika Maelge Art Gallery. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <PageHeader title="Privacy Policy" backHref="/" backLabel="Home" />

            <section className="pt-32 pb-24 px-6 lg:px-12">
                <div className="max-w-3xl mx-auto">
                    <p className="text-black/40 text-sm mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <div className="prose prose-lg max-w-none">
                        <div className="space-y-8">
                            <section>
                                <h2 className="text-2xl font-light text-black mb-4">Introduction</h2>
                                <p className="text-black/60 leading-relaxed font-light">
                                    Chandrika Maelge Art ("we," "our," or "us") respects your privacy and is committed to protecting
                                    your personal data. This privacy policy explains how we collect, use, and safeguard your information
                                    when you visit our website or make a purchase.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-black mb-4">Information We Collect</h2>
                                <p className="text-black/60 leading-relaxed font-light mb-4">We may collect the following types of information:</p>
                                <ul className="list-disc pl-6 space-y-2 text-black/60 font-light">
                                    <li><strong className="text-black/80">Personal Information:</strong> Name, email address, phone number, shipping address when you make a purchase or contact us.</li>
                                    <li><strong className="text-black/80">Newsletter Subscription:</strong> Email address when you subscribe to our newsletter.</li>
                                    <li><strong className="text-black/80">Usage Data:</strong> Information about how you use our website, including pages visited and time spent.</li>
                                    <li><strong className="text-black/80">Cookies:</strong> We use cookies to enhance your browsing experience.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-black mb-4">How We Use Your Information</h2>
                                <ul className="list-disc pl-6 space-y-2 text-black/60 font-light">
                                    <li>To process and fulfill your orders</li>
                                    <li>To send you updates about your orders</li>
                                    <li>To send newsletters and promotional materials (with your consent)</li>
                                    <li>To respond to your inquiries and provide customer support</li>
                                    <li>To improve our website and services</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-black mb-4">Data Protection</h2>
                                <p className="text-black/60 leading-relaxed font-light">
                                    We implement appropriate security measures to protect your personal information against unauthorized
                                    access, alteration, disclosure, or destruction. Your data is stored securely and accessed only by
                                    authorized personnel.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-black mb-4">Your Rights</h2>
                                <p className="text-black/60 leading-relaxed font-light mb-4">You have the right to:</p>
                                <ul className="list-disc pl-6 space-y-2 text-black/60 font-light">
                                    <li>Access your personal data</li>
                                    <li>Request correction of inaccurate data</li>
                                    <li>Request deletion of your data</li>
                                    <li>Unsubscribe from our newsletter at any time</li>
                                    <li>Opt-out of marketing communications</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-black mb-4">Third-Party Services</h2>
                                <p className="text-black/60 leading-relaxed font-light">
                                    We may use third-party services for payment processing, email delivery, and analytics. These
                                    services have their own privacy policies, and we encourage you to review them.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-black mb-4">Contact Us</h2>
                                <p className="text-black/60 leading-relaxed font-light">
                                    If you have any questions about this Privacy Policy, please{' '}
                                    <Link href="/contact" className="text-black hover:text-black/70 underline">
                                        contact us
                                    </Link>.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
