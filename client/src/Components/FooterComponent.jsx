
import { Link } from 'react-router-dom'
import { Footer, FooterCopyright, FooterDivider, FooterIcon, FooterLink, FooterLinkGroup, FooterTitle } from 'flowbite-react'
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";


const FooterComponent = () => {
    return (
        <Footer container className='border border-t-8 border-cyan-500'>
            <div className='w-full max-w-7xl mx-auto'>
                <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                    <div className='mb-5'>
                        <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold
                            '>
                            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
                                    via-purple-500 to-pink-500 rounded-lg text-white '>Kasa's</span>
                            Product
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 gap-8   mt-4 sm:grid-cols-3 sm:gap-6'>

                        <div>
                            <FooterTitle title='Follow Us' />
                            <FooterLinkGroup col>
                                <FooterLink
                                    href="https://github.com/4kasa786"
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >GitHub
                                </FooterLink>
                                <FooterLink
                                    href="https://www.linkedin.com/in/sarvesh-kishor-bhoyar-824787323/"
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >LinkedIn
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>
                        <div>
                            <FooterTitle title='Legal' />
                            <FooterLinkGroup col>
                                <FooterLink
                                    href='#'
                                >Privacy Policy
                                </FooterLink>
                                <FooterLink
                                    href='#'
                                >Terms &amp; Conditions
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>
                    </div>
                </div>
                <FooterDivider />
                <div className='w-full sm:flex sm:items-center justify-between '>
                    <FooterCopyright href='#' by="Kasa's Blog" year={new Date().getFullYear()} />
                    <div className='flex gap-6 sm:mt-0  mt-4 sm:justify-center  '>

                        <FooterIcon href="#" icon={BsFacebook} />
                        <FooterIcon href="#" icon={BsInstagram} />
                        <FooterIcon href="#" icon={BsTwitter} />
                        <FooterIcon href="#" icon={BsGithub} />
                        <FooterIcon href="#" icon={BsDribbble} />

                    </div>
                </div>
            </div>
        </Footer>
    )
}

export default FooterComponent