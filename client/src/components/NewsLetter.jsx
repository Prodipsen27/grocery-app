const NewsLetter = () => {
    
    return (
        <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 xl:mx-20 mt-20 mb-10 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 p-10 sm:p-14 flex flex-col items-center justify-center text-center">
            <h2 className="md:text-4xl text-2xl font-bold text-white">Never Miss a Deal!</h2>
            <p className="md:text-base text-sm text-green-100/80 mt-3 mb-8 max-w-lg">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts delivered to your inbox.
            </p>
            <form className="flex items-center w-full max-w-lg">
                <input
                    className="flex-1 h-12 md:h-13 rounded-l-full px-5 outline-none text-gray-700 text-sm border-0 placeholder:text-gray-400"
                    type="email"
                    placeholder="Enter your email address"
                    required
                />
                <button type="submit" className="h-12 md:h-13 px-6 md:px-10 text-green-700 bg-white font-semibold rounded-r-full hover:bg-green-50 transition-colors cursor-pointer text-sm">
                    Subscribe
                </button>
            </form>
        </div>
    )
}

export default NewsLetter;