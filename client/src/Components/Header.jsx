import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import { toast } from 'react-toastify'; // Changed from react-hot-toast to react-toastify

const Header = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const profilePicture =
        currentUser?.profilePicture ||
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if search term is not empty
        if (!searchTerm.trim()) {
            toast.warning('Please enter a search term');
            return;
        }

        // Create URL parameters for search
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', searchTerm.trim());
        urlParams.set('sortBy', 'createdAt');
        urlParams.set('sortOrder', 'desc');

        // Navigate to search results page
        navigate(`/search?${urlParams.toString()}`);
    };

    // Handle mobile search button click
    const handleMobileSearch = () => {
        if (!searchTerm.trim()) {
            toast.warning('Please enter a search term');
            return;
        }

        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', searchTerm.trim());
        urlParams.set('sortBy', 'createdAt');
        urlParams.set('sortOrder', 'desc');

        navigate(`/search?${urlParams.toString()}`);
    };

    const handleSignOut = async () => {
        try {
            const response = await fetch('/api/auth/signout', {
                method: 'POST',
            });
            const data = await response.json();
            if (!response.ok) {
                console.log(data.message);
                toast.error('Failed to sign out');
            } else {
                dispatch(signOutSuccess());
                toast.success('Signed out successfully');
            }
        } catch (error) {
            console.log(error.message);
            toast.error('Error signing out');
        }
    };

    return (
        <Navbar className="border-b-2">
            <Link
                to="/"
                className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold"
            >
                <span
                    className="px-2 py-1 bg-gradient-to-r from-indigo-500
                    via-purple-500 to-pink-500 rounded-lg text-white"
                >
                    Kasa's
                </span>
                Product
            </Link>

            <form onSubmit={handleSubmit} className="hidden lg:flex">
                <TextInput
                    type="text"
                    placeholder="Search products..."
                    rightIcon={AiOutlineSearch}
                    className="w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <Button
                className="w-12 h-10 p-0 lg:hidden rounded-full"
                color="light"
                onClick={handleMobileSearch}
            >
                <AiOutlineSearch />
            </Button>

            <div className="flex gap-2 md:order-2">
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={<Avatar alt="user" img={profilePicture} rounded />}
                        className="ml-2"
                    >
                        <DropdownHeader>
                            <span className="block text-sm font-bold">
                                @{currentUser.username}
                            </span>
                            <span className="block text-sm font-medium">
                                {currentUser.email}
                            </span>
                        </DropdownHeader>
                        <DropdownDivider />

                        <DropdownItem>Profile</DropdownItem>

                        <DropdownDivider />
                        <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
                    </Dropdown>
                ) : (
                    <Link to="/sign-in">
                        <Button className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300">
                            SignIn
                        </Button>
                    </Link>
                )}

                <NavbarToggle />
            </div>

            <NavbarCollapse>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-blue-500 font-normal text-sm md:text-lg'
                            : 'font-normal text-sm md:text-lg'
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/create-product"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-blue-500 font-normal text-sm md:text-lg'
                            : 'font-normal text-sm md:text-lg'
                    }
                >
                    Create Product
                </NavLink>

                {/* Mobile Search Input - Only visible on mobile */}
                <div className="lg:hidden mt-2">
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            type="text"
                            placeholder="Search products..."
                            rightIcon={AiOutlineSearch}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>
            </NavbarCollapse>
        </Navbar>
    );
};

export default Header;