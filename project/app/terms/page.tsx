import { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

export const metadata: Metadata = {
    title: 'Terms of Service - Chandrika Maelge Art',
    description: 'Terms of Service for Chandrika Maelge Art Gallery. Read our terms and conditions for purchasing artwork and using our website.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <PageHeader title="Terms of Service" />

            <section className="pt-32 pb-24 px-6 lg:px-12">
                <div className="max-w-3xl mx-auto">
                    <p className="text-white/40 text-sm mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="space-y-8">
                            <section>
                                <h2 className="text-2xl font-light text-white mb-4">Acceptance of Terms</h2>
                                <p className="text-white/60 leading-relaxed font-light">
                                    By accessing and using the Chandrika Maelge Art website, you agree to be bound by these Terms of
                                    Service. If you do not agree with any part of these terms, please do not use our website.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-white mb-4">Artwork Purchases</h2>
                                <ul className="list-disc pl-6 space-y-2 text-white/60 font-light">
                                    <li>All artwork prices are listed in Sri Lankan Rupees (LKR) unless otherwise specified.</li>
                                    <li>Prices are subject to change without notice.</li>
                                    <li>Original artworks are one-of-a-kind pieces. Once sold, they are no longer available.</li>
                                    <li>Limited edition prints are numbered and certified.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-white mb-4">Payment Terms</h2>
                                <p className="text-white/60 leading-relaxed font-light">
                                    Full payment is required before artwork shipment. We accept bank transfers and other payment
                                    methods as specified during checkout. For commission work, a 50% deposit is required upfront.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-white mb-4">Shipping & Delivery</h2>
                                <ul className="list-disc pl-6 space-y-2 text-white/60 font-light">
                                    <li>Artwork is carefully packaged to ensure safe delivery.</li>
                                    <li>Shipping costs are calculated based on destination and artwork size.</li>
                                    <li>Delivery times vary depending on location (typically 5-14 business days).</li>
                                    <li>International shipping is available to most countries.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-white mb-4">Returns & Refunds</h2>
                                <p className="text-white/60 leading-relaxed font-light mb-4">
                                    Due to the unique nature of original artwork:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-white/60 font-light">
                                    <li>Returns are accepted within 14 days of delivery if artwork is damaged or not as described.</li>
                                    <li>Artwork must be returned in original packaging and condition.</li>
                                    <li>Custom commissions are non-refundable once work has begun.</li>
                                    <li>Refunds will be processed within 7-10 business days.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-white mb-4">Intellectual Property</h2>
                                <p className="text-white/60 leading-relaxed font-light">
                                    All artwork, images, and content on this website are the intellectual property of Chandrika Maelge.
                                    Purchasing artwork grants ownership of the physical piece but not reproduction rights. Unauthorized
                                    reproduction, distribution, or commercial use is prohibited.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-white mb-4">Commission Work</h2>
                                <ul className="list-disc pl-6 space-y-2 text-white/60 font-light">
                                    <li>Commission requests are subject to artist availability.</li>
                                    <li>Detailed discussions will determine scope, timeline, and pricing.</li>
                                    <li>The artist reserves creative freedom within agreed parameters.</li>
                                    <li>Progress updates will be provided at key stages.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-white mb-4">Limitation of Liability</h2>
                                <p className="text-white/60 leading-relaxed font-light">
                                    Chandrika Maelge Art is not liable for any indirect, incidental, or consequential damages arising
                                    from the use of this website or purchase of artwork, except as required by law.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-light text-white mb-4">Contact</h2>
                                <p className="text-white/60 leading-relaxed font-light">
                                    For questions about these Terms of Service, please{' '}
                                    <Link href="/contact" className="text-white hover:text-white/70 underline">
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
