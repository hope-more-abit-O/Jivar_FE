import React from 'react';
import { Search, ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLoadingNavigation } from '../../util/useLoadingNavigation';
import logo from '../../assets/7537044.jpg'

export default function JivarHome() {
    const { isLoading, navigateWithLoading } = useLoadingNavigation();

    const handleSignIn = (e) => {
        e.preventDefault();
        navigateWithLoading('/authentication/sign-in');
    };
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <img src={logo} alt="Jivar" className="h-8" />
                            <nav className="hidden md:flex items-center space-x-6">
                                <button className="flex items-center space-x-1 text-[#42526E] hover:text-blue-600">
                                    <span>Products</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                <button className="flex items-center space-x-1 text-[#42526E] hover:text-blue-600">
                                    <span>Teams</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                <button className="flex items-center space-x-1 text-[#42526E] hover:text-blue-600">
                                    <span>Why Jivar?</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                <button className="flex items-center space-x-1 text-[#42526E] hover:text-blue-600">
                                    <span>Resources</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                <button className="text-[#42526E] hover:text-blue-600">
                                    Enterprise
                                </button>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <Search className="h-5 w-5 text-gray-500" />
                            </button>
                            <Link
                                to="/authentication/sign-in"
                                className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                <section className="py-20 bg-[#DEEBFF]">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl font-bold mb-6 text-[#253858]">
                            The new Jivar:
                            <br />
                            from <span className="relative inline-block">
                                teams
                                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 9C50 1 150 1 199 9" stroke="#FF5630" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span> to dreams
                        </h1>
                        <Link
                            to="/authentication/sign-in"
                            className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors">
                            Get started
                        </Link>

                        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
                            {[
                                { icon: "💻", label: "Software" },
                                { icon: "⚙️", label: "Product management" },
                                { icon: "📢", label: "Marketing" },
                                { icon: "📋", label: "Project management" },
                                { icon: "🎨", label: "Design" },
                                { icon: "🖥️", label: "IT" }
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col items-center space-y-2">
                                    <span className="text-4xl">{item.icon}</span>
                                    <span className="text-sm text-[#42526E]">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12 text-[#253858]">Jivar solutions</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { title: "Agile & DevOps", description: "Run a world-class agile software company—from discovery to delivery and operations" },
                                { title: "IT Service Management", description: "Enable dev, IT ops, and business teams to deliver great service at high velocity" },
                                { title: "Work Management", description: "Empower autonomous teams without losing organizational alignment" },
                                { title: "Enterprise Solutions", description: "Get the right information to the right people at the right time across your organization" }
                            ].map((solution, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold mb-2 text-[#253858]">{solution.title}</h3>
                                    <p className="text-[#42526E] mb-4">{solution.description}</p>
                                    <a href="#" className="text-blue-600 font-medium hover:underline flex items-center">
                                        Learn more <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-[#F4F5F7]">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-8 text-[#253858]">Join the Jivar community</h2>
                        <p className="text-xl text-[#42526E] mb-8">Connect, share, and learn from Jivar experts and product users around the world.</p>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors">
                            Discover community
                        </button>
                    </div>
                </section>
            </main>

            <footer className="bg-[#172B4D] text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="font-semibold mb-4">Products</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">Jivar Software</a></li>
                                <li><a href="#" className="hover:underline">Confluence</a></li>
                                <li><a href="#" className="hover:underline">Trello</a></li>
                                <li><a href="#" className="hover:underline">Bitbucket</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">Technical Support</a></li>
                                <li><a href="#" className="hover:underline">Purchasing & licensing</a></li>
                                <li><a href="#" className="hover:underline">Jivar Community</a></li>
                                <li><a href="#" className="hover:underline">Knowledge base</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">About Jivar</a></li>
                                <li><a href="#" className="hover:underline">Careers</a></li>
                                <li><a href="#" className="hover:underline">Events</a></li>
                                <li><a href="#" className="hover:underline">Contact us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Connect with us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="hover:text-blue-400">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="hover:text-blue-400">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="hover:text-blue-400">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-700 text-sm text-gray-400">
                        <p>&copy; 2024 Jivar. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}