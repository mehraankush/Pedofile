'use client';
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className=" bg-primary  text-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Pedofile</h2>
                        <p className="text-sm text-gray-400">
                            Empowering your digital experience with fast, secure, and scalable solutions.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white">Home</Link></li>
                            <li><Link href="#" className="hover:text-white line-through">About</Link></li>
                            <li><Link href="#" className="hover:text-white line-through">Services</Link></li>
                            <li><Link href="#" className="hover:text-white line-through">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-white line-through">Docs</Link></li>
                            <li><Link href="#" className="hover:text-white line-through">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white line-through">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-white line-through">Support</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4 text-xl text-gray-400">
                            <Link href="https://twitter.com" className="hover:text-white"><Twitter /></Link>
                            <Link href="https://github.com" className="hover:text-white"><Github /></Link>
                            <Link href="https://linkedin.com" className="hover:text-white"><Linkedin /></Link>
                            <Link href="https://instagram.com" className="hover:text-white"><Instagram /></Link>
                        </div>
                    </div>

                </div>

                <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                    © 2025 Pedofile. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
