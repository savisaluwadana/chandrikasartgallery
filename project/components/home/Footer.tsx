'use client';

import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-white/[0.05] py-24 px-6 lg:px-12 bg-[#020202]">
            <div className="max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="block mb-8">
                            <span className="text-2xl tracking-[0.2em] font-light uppercase">
                                Chandrika <span className="font-medium">Maelge</span>
                            </span>
                        </Link>
                        <p className="text-white/30 text-lg max-w-sm leading-relaxed font-light">
                            Creating art that speaks to the soul. Based in Sri Lanka,
                            exhibited worldwide.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-2 lg:col-start-7">
                        <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-8">Explore</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Gallery', href: '/gallery' },
                                { label: 'Collection', href: '/shop' },
                                { label: 'Journal', href: '/blog' },
                                { label: 'About', href: '/about' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-white/50 hover:text-white transition-colors font-light">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-8">Connect</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Subscribe', href: '/subscribe' },
                                { label: 'Contact', href: '/contact' },
                                { label: 'Instagram', href: 'https://instagram.com' },
                                { label: 'Studio', href: '/admin' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-white/50 hover:text-white transition-colors font-light"
                                        {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-8">Legal</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Privacy Policy', href: '/privacy' },
                                { label: 'Terms of Service', href: '/terms' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-white/50 hover:text-white transition-colors font-light">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/20 text-xs font-light tracking-wide">
                        © {new Date().getFullYear()} CHANDRIKA MAELGE ART. ALL RIGHTS RESERVED.
                    </p>
                    <p className="text-white/20 text-xs font-light tracking-wide">
                        DESIGNED WITH PASSION
                    </p>
                </div>
            </div>
        </footer>
    );
}
