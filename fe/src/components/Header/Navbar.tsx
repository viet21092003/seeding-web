import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineLogin } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import ReactSelect from "react-select";
import { getCartByUser, logoutUser } from "../../api/axios"
import DynamicPlaceholder from "./DynamicPlaceholder";
import Logo from "../../assets/images/logo.png";
import routes from "../../config/routes";
import { Emitter } from "../../eventEmitter/EventEmitter";
import { RootState } from "../../redux/store";
import { GetUserInfoDto } from "../../types/types";

const Navbar: FC = () => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isLogin = localStorage.getItem("user");
  const { t, i18n } = useTranslation();
  const [langOptions] = useState([
    { value: "vi", label: "Tiếng việt" },
    { value: "en", label: "English" },
  ]);

  const user: GetUserInfoDto | null = useSelector(
    (state: RootState) => state.auth.currentUser
  );
  console.log(user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const activeNavLink = ({ isActive }: { isActive: boolean }) => {
    return isActive ? "text-base  underline" : "text-base ";
  };

  useEffect(() => {
    const fetchCart = async () => {
      const listCartPay = await getCartByUser(user?.id);
      setCartCount(listCartPay.length);
    };
    if (user) {
      fetchCart();
    }
    const handleEvent = () => {
      fetchCart();
    };

    Emitter.on("updateCartNumber", handleEvent);

    return () => {
      Emitter.off("updateCartNumber", handleEvent);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="py-4 bg-white">
      <div className="wrapper px-6 xl:px-0">
        <div className="flex justify-between items-center gap-8">
          <Link to="/" className="font-[IntegralCf] text-[24px]">
            <img src={Logo} alt="" className="w-32" />
          </Link>
          <DynamicPlaceholder />

          <ul className="hidden lg:flex space-x-12">
            <NavLink
              to={routes.home}
              className={activeNavLink}
              key={routes.home}
            >
              {t("nav.home")}
            </NavLink>

            <NavLink
              to={routes.product}
              className={activeNavLink}
              key={routes.product}
            >
              {t("nav.products")}
            </NavLink>

            <NavLink
              to={routes.contact}
              className={activeNavLink}
              key={routes.contact}
            >
              {t("nav.contact")}
            </NavLink>

            <NavLink
              to={routes.live}
              className={activeNavLink}
              key={routes.live}
            >
              {t("nav.live")}
            </NavLink>
          </ul>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-[20px]">
              <div className="relative">
                <Link to="/cart" className="relative">
                  <IoCartOutline className="w-7 h-7 mt-1" />
                  {cartCount > 0 && (<div className="transition-all duration-300 w-5 h-5 rounded-full bg-red-600 text-white absolute top-0 text-sm right-[-10px] border border-white text-center">{cartCount}</div>)}
                </Link>
              </div>
              {isLogin ? (
                <button className="hidden lg:block" onClick={logoutUser}>
                  {t("button.logout")}{" "}
                  <AiOutlineLogin className="w-6 h-6 inline-block" />
                </button>
              ) : (
                <Link to={"/login"} className="hidden lg:block">
                  {t("nav.login")}{" "}
                  <AiOutlineLogin className="w-6 h-6 inline-block" />
                </Link>
              )}
              <ReactSelect
                options={langOptions}
                isSearchable={false}
                defaultValue={langOptions.find(option => option.value === i18n.language)}
                onChange={(option) => i18n.changeLanguage(option?.value)}
              />
            </div>

            {/* Mobile menu */}
            <div className="lg:hidden">
              <button onClick={toggleMenu}>
                {isMenuOpen ? (
                  <FaXmark className="w-6 h-6 mt-2" />
                ) : (
                  <FaBars className="w-6 h-6 mt-2" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <div
          ref={menuRef}
          className={`bg-black w-custom-width h-full text-white z-50 ${isMenuOpen ? "block fixed top-0 right-0 left-0" : "hidden"
            }`}
        >
          <Link
            to="/"
            onClick={toggleMenu}
            className="font-[IntegralCf] block text-[24px] py-4 px-4"
          >
            SEEDLING
          </Link>
          <ul className="space-y-2 border-b ">
            {/* {navItems.map(({ title, to }) => (
              <Link onClick={toggleMenu} to={to} key={to}>
                <li className="py-3 px-4 hover:bg-[#484a4b]">{title}</li>
              </Link>
            ))} */}

            <Link onClick={toggleMenu} to={routes.home} key={routes.home}>
              <li className="py-3 px-4 hover:bg-[#484a4b]">{t("nav.home")}</li>
            </Link>

            <Link onClick={toggleMenu} to={routes.product} key={routes.product}>
              <li className="py-3 px-4 hover:bg-[#484a4b]">
                {t("nav.products")}
              </li>
            </Link>

            <Link onClick={toggleMenu} to={routes.contact} key={routes.contact}>
              <li className="py-3 px-4 hover:bg-[#484a4b]">
                {t("nav.contact")}
              </li>
            </Link>

            <Link onClick={toggleMenu} to={routes.live} key={routes.live}>
              <li className="py-3 px-4 hover:bg-[#484a4b]">{t("nav.live")}</li>
            </Link>
          </ul>
          {isLogin ? (
            <button
              onClick={logoutUser}
              className="w-full text-left py-3 px-4 hover:bg-[#484a4b]"
            >
              {t("button.logout")}{" "}
              <AiOutlineLogin className="w-6 h-6 inline-block" />
            </button>
          ) : (
            <Link
              to={"/login"}
              className="w-full text-left py-3 px-4 hover:bg-[#484a4b] block"
            >
              {t("nav.login")}{" "}
              <AiOutlineLogin className="w-6 h-6 inline-block" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
