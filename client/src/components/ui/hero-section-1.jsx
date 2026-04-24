import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection({ 
    title = "Empowering Lives Through Community Learning",
    subtitle = "E-Kabuhayan LMS provides accessible, quality training for Barangay San Isidro residents to develop skills and improve livelihoods.",
    primaryActionLabel = "Inquire →",
    primaryActionHref = "https://www.facebook.com/PLRMO",
    secondaryActionLabel = "Learn More →",
    secondaryActionHref = "#features"
}) {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden relative">
                {/* Decorative Background Shapes from Prompt */}
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(120,40%,85%,.08)_0,hsla(120,40%,55%,.02)_50%,hsla(120,40%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(120,40%,85%,.06)_0,hsla(120,40%,45%,0.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(120,40%,85%,.04)_0,hsla(120,40%,45%,0.02)_80%,transparent_100%)]" />
                </div>

                <section className="relative min-h-[100vh] flex items-center overflow-hidden">
                    {/* 1. Base Image Layer (Guaranteed visibility) */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/plmro.jpg"
                            alt="PLRMO Office"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* 2. Aesthetic Blur & Light Overlay Layer */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[3px]"></div>

                    {/* 3. Subtle Bottom Gradient Fade for professional finish */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F1F3E0]/80 via-transparent to-transparent"></div>

                    {/* 4. Hero Content Layer */}
                    <div className="relative z-10 mx-auto max-w-7xl px-30 w-full">
                        <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                            <AnimatedGroup variants={transitionVariants}>
                                <h1
                                    className="mt-8 max-w-4xl mx-auto text-balance text-4xl md:text-6xl lg:text-7xl font-black text-[#2D4F2B] leading-tight">
                                    Empowering Lives Through <span className="text-[#FFB823]">Community Learning</span>
                                </h1>
                                <p
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg text-[#2D4F2B] ">
                                    {subtitle}
                                </p>
                            </AnimatedGroup>

                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                                className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                                <div
                                    key={1}
                                    className="bg-[#2D4F2B]/10 rounded-[14px] border border-[#2D4F2B]/5 p-0.5">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="rounded-xl px-10 text-base bg-[#2D4F2B] text-white hover:bg-[#1e3a1c] border-none font-black shadow-xl shadow-[#2D4F2B]/20 h-14">
                                        <Link to="/role">
                                            <span className="text-nowrap">{primaryActionLabel}</span>
                                        </Link>
                                    </Button>
                                </div>
                                <Button
                                    key={2}
                                    asChild
                                    size="lg"
                                    variant="ghost"
                                    className="h-14 rounded-xl px-10 text-[#2D4F2B] hover:bg-white/80 border-2 border-[#2D4F2B]/20 font-black backdrop-blur-md bg-white/40 shadow-lg">
                                    <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                                        <span className="text-nowrap">{secondaryActionLabel}</span>
                                    </button>
                                </Button>
                            </AnimatedGroup>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'About Us', href: '#about' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-[10000] w-full px-2 group">
                <div className={cn(
                    'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', 
                    isScrolled && 'bg-white/80 max-w-4xl rounded-2xl border border-[#2D4F2B]/10 backdrop-blur-lg lg:px-5 shadow-lg'
                )}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                to="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-[#2D4F2B]">
                                {!menuState ? <Menu className="m-auto size-6 duration-200" /> : <X className="m-auto size-6 duration-200" />}
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href={item.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="text-[#2D4F2B]/70 hover:text-[#2D4F2B] block duration-150 font-semibold uppercase tracking-wider text-[11px]">
                                            <span>{item.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={cn(
                            "bg-white lg:bg-transparent mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:p-0 lg:shadow-none",
                            menuState && "block absolute top-full left-0 right-0 mt-2 border-[#2D4F2B]/10"
                        )}>
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.href}
                                                onClick={() => setMenuState(false)}
                                                className="text-[#2D4F2B]/70 hover:text-[#2D4F2B] block duration-150 font-bold uppercase text-sm">
                                                <span>{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-[#2D4F2B] text-white hover:bg-[#2D4F2B]/90 font-bold rounded-full px-6">
                                    <Link to="/role">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = () => {
    return (
        <div className="flex items-center gap-3 font-bold">
            <img src="/images/logo2.gif" alt="Logo" className="w-10 h-10" />
            <span className="text-lg lg:text-xl font-extrabold">
                <span className="text-yellow-400">E</span>
                <span className="text-[#FFB823]">-Kabuhayan</span>
            </span>
        </div>
    )
}
