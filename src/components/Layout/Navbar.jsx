import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as authLogout, selectNormalizedUser } from "../../redux/slices/authSlice";
import { fetchProfile, selectUser } from "../../redux/slices/userSlice";
import { fetchSellerProfile, selectSeller } from "../../redux/slices/sellerSlice";
import { addLocalRecentlyViewed } from "../../redux/slices/recentlyViewedSlice";
import { loadCart } from "../../redux/slices/cartSlice";
import { fetchSearchResults, setSearchTerm,saveRecentSearch } from "../../redux/slices/searchSlice";

const Navbar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Selectors
  const userInfo = useSelector(selectNormalizedUser); // authSlice user (could be null)
  const user = useSelector(selectUser); // userSlice
  const seller = useSelector(selectSeller); // sellerSlice
  const cartItems = useSelector((state) => state.cart.items);
  const { results, loading } = useSelector((state) => state.search);
  const recentProducts = useSelector(state => state.recentlyViewed.items);

  // Safe authentication check
  const isAuthenticated = !!userInfo;
  const role = userInfo?.role || userInfo?.roles?.[0] || "GUEST"; // assign "GUEST" if null

  // Local state
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Safe profile link
  const profileLink =
    role === "ROLE_SELLER"
      ? "/seller/dashboard"
      : role === "ROLE_USER"
      ? "/profile"
      : "/";

  console.log("Resolved role:", role, "→ profileLink:", profileLink);
  console.log("localStorage user in Navbar:", localStorage.getItem("user"));
  useEffect(() => {
  if (!isAuthenticated || !localStorage.getItem("token")) return;

  const fetchUserData = async () => {
    try {
      if (role === "ROLE_USER") {
        await dispatch(fetchProfile());
        await dispatch(loadCart());
      } else if (role === "ROLE_SELLER") {
        await dispatch(fetchSellerProfile());
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  fetchUserData();
}, [isAuthenticated, role, dispatch]);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Search handling
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        console.log("Live search query:", query);
        dispatch(setSearchTerm(query));
        dispatch(fetchSearchResults(query))
        .unwrap()
      .then((res) => console.log("API results:", res))
      .catch((err) => console.error("Search error:", err));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, dispatch]);

  useEffect(() => {
  // Sync Redux with localStorage for guest users
  const stored = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
  if (!userInfo && stored.length) { // guest user only
    stored.forEach(product => dispatch(addLocalRecentlyViewed(product)));
  }
}, [dispatch, userInfo]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token && isAuthenticated) {
    dispatch(authLogout());
  }
}, [isAuthenticated, dispatch]);
  // Logout
  const handleLogout = () => {
    dispatch(authLogout());
    dispatch({ type: "user/clearUser" });
    dispatch({ type: "seller/clearSeller" });
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[1000] relative">
      <div className="w-full overflow-visible px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="text-2xl font-extrabold text-indigo-600">
              M-Mart
            </Link>
            <span className="text-xs text-gray-500">— marketplace</span>
          </div>

          {/* Search Bar */}
     <div className="relative flex-1">
      <div className="flex items-center bg-slate-100 rounded-md overflow-hidden">
       <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && query.trim()) {
          saveRecentSearch(query);
         //navigate(`/search?q=${encodeURIComponent(query)}&selected=${item.productId}`);
        navigate(`/search?q=${encodeURIComponent(query)}`); // Only query
          setQuery("");
        }
      }}
      placeholder="Search products, brands, price, category..."
      className="flex-1 px-4 py-3 bg-transparent outline-none text-sm text-gray-800"
    />
  </div>

  {/* Search Dropdown */}
  {query.trim() && (
    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto z-[9999]">
      {loading && <p className="p-2 text-gray-500 text-sm">Searching...</p>}

      {!loading && (
        <>
          {results
            ?.filter((item) =>
              item?.name?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 6)
            .map((item) => {
              if (!item || !item.productId) return null;

              const name = item.name || "Unnamed Product";
              const brand =
                typeof item.brand === "object"
                  ? item.brand?.name || "Unknown"
                  : item.brand || "Unknown";
              const category =
                typeof item.category === "object"
                  ? item.category?.name || "Uncategorized"
                  : item.category || "Uncategorized";
              const price =
                item.price !== null && item.price !== undefined
                  ? Number(item.price).toFixed(2)
                  : "0.00";
              const imageUrl = item.image_url || item.imageUrl || "/placeholder.png";

              return (
                <div
                  key={item.productId}
                  onClick={() => {
                    saveRecentSearch(query);
                     navigate(`/search?q=${encodeURIComponent(query)}&selected=${item.productId}`);
                     setQuery(""); // clear search after click
                  }}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 transition"
                >
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{name}</span>
                    <p className="text-xs text-gray-500">
                      {brand} • ${price} • {category}
                    </p>
                  </div>
                </div>
              );
            })}
             {results.filter((item) =>
              item?.name?.toLowerCase().includes(query.toLowerCase())
              ).length === 0 && (
            <p className="p-2 text-gray-500 text-sm">No products found.</p>
          )}
             </>
             )}
         </div>
       )}
     </div>


          {/* Desktop Right Section */}
          <div className="hidden sm:flex items-center gap-6 flex-shrink-0" ref={dropdownRef}>
            {/* Guest Links */}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-sm text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link to="/login" className="text-sm text-gray-700 hover:text-indigo-600">
                  Be Seller
                </Link>
              </>
            )}

            {/* Authenticated */}
            {isAuthenticated && (
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === "profile" ? null : "profile")}
                  className="flex items-center gap-2 text-sm text-gray-900 cursor-pointer hover:text-indigo-600"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                    {userInfo?.firstName?.[0]?.toUpperCase() ||
                      userInfo?.email?.[0]?.toUpperCase() ||
                      "U"}
                  </div>
                  <span>{userInfo?.firstName || userInfo?.email || "Profile"}</span>
                </button>

                {dropdownOpen === "profile" && (
                  <div className="absolute right-2 top-full mt-2 bg-gray-700 text-white rounded p-2 min-w-[140px] shadow-lg z-[9999]">
                    <Link
                      to={profileLink}
                      className="block px-2 py-1 rounded hover:bg-gray-600"
                      onClick={() => setDropdownOpen(null)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(null);
                        handleLogout();
                      }}
                      className="block w-full text-left px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            {(role === "ROLE_USER" || role === "GUEST") && (
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-sm">Cart ({cartItems.length})</div>
              </Link>
            )}

            {/* More Options */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(dropdownOpen === "more" ? null : "more")}
                className="px-2 py-1 rounded-md flex items-center gap-1 hover:bg-gray-100 cursor-pointer"
                title="More Options"
              >
                <span className="text-lg font-bold text-gray-700">⋮</span>
              </button>

              {dropdownOpen === "more" && (
                <div className="absolute right-2 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-[9999]">
                  <Link
                    to="/notifications"
                    className="block px-3 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(null)}
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/help"
                    className="block px-3 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(null)}
                  >
                    Help
                  </Link>
                  <Link
                    to="/about-us"
                    className="block px-3 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(null)}
                  >
                    About Us
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-[9999] flex flex-col gap-2 p-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                    >
                      Login
                    </Link>
                    <Link
                      to="/login"
                      className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                    >
                      Be Seller
                    </Link>
                    <Link
                        to="/cart"
                        className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Cart ({cartItems.length})
                      </Link>
                      <Link
                      to="/notifications"
                      className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Notifications
                    </Link>
                    <Link
                      to="/help"
                      className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Help
                    </Link>
                    <Link
                      to="/about-us"
                      className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={profileLink}
                      className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {userInfo?.firstName || userInfo?.email || "Profile"}
                    </Link>

                    {role === "ROLE_USER" && (
                      <Link
                        to="/cart"
                        className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Cart ({cartItems.length})
                      </Link>
                    )}

                    {role === "ROLE_SELLER" && (
                      <Link
                        to="/seller/dashboard"
                        className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                    >
                      Logout
                    </button>

                    <Link
                      to="/notifications"
                      className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Notifications
                    </Link>
                    <Link
                      to="/help"
                      className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Help
                    </Link>
                    <Link
                      to="/about-us"
                      className="px-3 py-2 text-gray-800 hover:bg-gray-100 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;