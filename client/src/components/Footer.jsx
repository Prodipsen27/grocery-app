import { assets, footerLinks } from "../assets/assets";

const Footer = () => {

    return (
        <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 bg-gradient-to-b from-green-50 to-green-100/50">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-12 border-b border-green-200/50 text-gray-500">
                <div>
                    <div className="text-2xl font-bold text-green-600">🍃 LeafCart</div>
                    <p className="max-w-[410px] mt-4 text-sm leading-relaxed">We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we aim to make your shopping experience simple and affordable.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-800 md:mb-4 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-2">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:text-green-600 transition-colors">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-5 text-center text-sm text-gray-400">
                Copyright {new Date().getFullYear()} © LeafCart. All Rights Reserved.
            </p>
        </div>
    );
};

export default Footer;