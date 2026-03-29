import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { categories } from '../assets/assets';
import { SlidersHorizontal, X } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'default' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Name A–Z', value: 'name-asc' },
];

const Shop = () => {
  const { products } = useAppContext();
  const [filtered, setFiltered] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  // Toggle category filter
  const toggleCategory = (path) => {
    setSelectedCategories((prev) =>
      prev.includes(path) ? prev.filter((c) => c !== path) : [...prev, path]
    );
  };

  // Clear all filters
  const clearAll = () => {
    setSelectedCategories([]);
    setSortBy('default');
  };

  // Filter & sort
  useEffect(() => {
    let result = products.filter((p) => p.inStock);

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.some((cat) => p.category.toLowerCase() === cat.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.offerPrice - a.offerPrice);
    } else if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(result);
  }, [products, selectedCategories, sortBy]);

  return (
    <div className="mt-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight border-l-4 border-green-500 pl-4">
          Shop
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 ml-5">
          Browse, filter, and find exactly what you need
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.path}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.path)}
                      onChange={() => toggleCategory(cat.path)}
                      className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-400 accent-green-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-green-600 transition">
                      {cat.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Sort By</h3>
              <div className="space-y-2">
                {SORT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === opt.value}
                      onChange={() => setSortBy(opt.value)}
                      className="w-4 h-4 text-green-500 focus:ring-green-400 accent-green-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-green-600 transition">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear */}
            {(selectedCategories.length > 0 || sortBy !== 'default') && (
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden fixed bottom-6 right-6 z-30 bg-green-500 text-white p-3.5 rounded-full shadow-lg hover:bg-green-600 transition cursor-pointer"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setShowFilters(false)}>
            <div
              className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl overflow-y-auto animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="cursor-pointer">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Categories</h4>
                <div className="space-y-2.5">
                  {categories.map((cat) => (
                    <label key={cat.path} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.path)}
                        onChange={() => toggleCategory(cat.path)}
                        className="w-4 h-4 rounded text-green-500 accent-green-500"
                      />
                      <span className="text-sm text-gray-600">{cat.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Sort By</h4>
                <div className="space-y-2.5">
                  {SORT_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="sort-mobile"
                        checked={sortBy === opt.value}
                        onChange={() => setSortBy(opt.value)}
                        className="w-4 h-4 text-green-500 accent-green-500"
                      />
                      <span className="text-sm text-gray-600">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearAll}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1">
          {/* Active filters */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((cat) => {
                const catData = categories.find((c) => c.path === cat);
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-100 text-green-700 px-3 py-1.5 rounded-full"
                  >
                    {catData?.text || cat}
                    <button onClick={() => toggleCategory(cat)} className="hover:text-green-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Results count */}
          <p className="text-sm text-gray-400 mb-4">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products match your filters.</p>
              <button
                onClick={clearAll}
                className="mt-4 text-green-600 font-medium hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
