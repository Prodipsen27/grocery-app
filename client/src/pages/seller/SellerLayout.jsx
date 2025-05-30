
import { Link, NavLink, Outlet } from "react-router-dom"
import { assets } from "../../assets/assets"
import { useAppContext } from "../../context/AppContext"

const SellerLayout = () => {
const { setIsSeller } = useAppContext()

const sidebarLinks = [
{ name: "Add Product", path: "/seller", icon: assets.add_icon },
{ name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
{ name: "Orders", path: "/seller/orders", icon: assets.order_icon },
]

const logout = async () => {
setIsSeller(false)
}

return ( <div className="min-h-screen flex flex-col">
{/* Top Navbar */} <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-4 bg-white shadow-sm"> <Link
       to="/"
       className="text-2xl font-extrabold text-green-600 transition duration-300 ease-in-out hover:scale-105"
     >
LeafCart </Link> <div className="flex items-center gap-4 text-gray-700"> <p className="hidden sm:block font-medium">Hi! Admin</p> <button
         onClick={logout}
         className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1 rounded-full transition"
       >
Logout </button> </div> </div>


  {/* Main Layout */}
  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar */}
    <div className="w-16 md:w-64 border-r border-gray-200 bg-white py-6 overflow-y-auto">
      <nav className="flex flex-col gap-1">
        {sidebarLinks.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/seller"}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 gap-4 transition-all duration-200 ${
                isActive
                  ? "bg-green-100 text-green-600 border-r-4 border-green-500"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <img src={item.icon} alt={item.name} className="w-6 h-6" />
            <span className="hidden md:inline font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>

    {/* Content */}
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
      <Outlet />
    </main>
  </div>
</div>

)
}

export default SellerLayout
