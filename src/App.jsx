import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Star, Users, Globe, Heart, BookOpen, Award, ArrowRight, ChevronDown, Sun, Moon } from 'lucide-react'


function App() {
    const [currentQuiz, setCurrentQuiz] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showAnswer, setShowAnswer] = useState(false)
    // new UI states
    const [scrollProgress, setScrollProgress] = useState(0)
    const [showBackTop, setShowBackTop] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')
    // video handling
    const videoRef = useRef(null)
    const [videoCanPlay, setVideoCanPlay] = useState(false)
    const [videoFailed, setVideoFailed] = useState(false)
    // timeline background video
    const timelineVideoRef = useRef(null)
    const [timelineVideoCanPlay, setTimelineVideoCanPlay] = useState(false)
    const [timelineVideoFailed, setTimelineVideoFailed] = useState(false)
    // active sub-topic inside international section
    const [activeIntlTopic, setActiveIntlTopic] = useState('intl-role')
    // Intro overlay state
    const [showIntro, setShowIntro] = useState(false)
    const [showAnswerModal, setShowAnswerModal] = useState(false)
    const introHeadingRef = useRef(null)
    const lastFocusedRef = useRef(null)
    // debug overlay for intl section
    const [intlDebug, setIntlDebug] = useState(false)

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Navigation items (label -> target id)
    const navItems = [
        { id: 'hero', label: 'Trang chủ' },
        { id: 'timeline', label: 'Hành trình' },
        { id: 'thoi-ky-qua-do', label: 'Thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam' },
        { id: 'moi-quan-he', label: 'Mối quan hệ giữa độc lập dân tộc và chủ nghĩa xã hội' },
        { id: 'video-giang-giai', label: 'Video giải thích' }, 
        { id: 'cau-hoi-suy-ngam', label: 'Câu hỏi suy ngẫm' },
        { id: 'quiz', label: 'Quiz' },
        { id: 'tinh-minh-bach-ai', label: 'Tính minh bạch AI' }
    ]

    // Function to scroll to next section
    const scrollToNextSection = (currentSectionId) => {
        const currentIndex = navItems.findIndex(item => item.id === currentSectionId)
        if (currentIndex !== -1 && currentIndex < navItems.length - 1) {
            const nextSection = navItems[currentIndex + 1]
            const element = document.getElementById(nextSection.id)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }
    }

    // Function to scroll to top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const quizQuestions = [
        {
            question: 'Theo Hồ Chí Minh, độc lập dân tộc phải gắn liền với chủ nghĩa xã hội vì lý do nào sau đây?',
            options: [
                'Để duy trì vương triều phong kiến như các tiền nhân.',
                'Để đảm bảo độc lập thực sự, tránh lệ thuộc và mang lại tự do, hạnh phúc cho nhân dân lao động.',
                'Để theo đuổi mô hình tư bản chủ nghĩa như các nước phương Tây.',
                'Để chỉ tập trung vào việc đánh đuổi ngoại xâm mà không cần cải tạo xã hội.'
            ],
            correct: 1,
            explanation: 'Hồ Chí Minh nhấn mạnh rằng chỉ có chủ nghĩa xã hội mới giải phóng được các dân tộc bị áp bức khỏi ách nô lệ, khác biệt với quan niệm độc lập của tiền nhân chủ yếu tập trung vào lãnh thổ mà không gắn với giải phóng giai cấp.'
        },
        {
            question: 'Sự khác biệt chính giữa quan niệm độc lập dân tộc của Hồ Chí Minh so với các tiền nhân như Phan Bội Châu hay Phan Châu Trinh là gì?',
            options: [
                'Không gắn với bất kỳ chủ nghĩa nào, chỉ thuần túy yêu nước.',
                'Vận dụng sáng tạo chủ nghĩa Mác-Lênin, gắn độc lập với chủ nghĩa xã hội và quốc tế vô sản.',
                'Chỉ hướng về phương Đông hoặc phương Tây mà không sáng tạo.',
                'Tập trung vào việc khôi phục chế độ quân chủ phong kiến.'
            ],
            correct: 1,
            explanation: 'Các tiền nhân như Phan Bội Châu hướng Nhật Bản hoặc Phan Châu Trinh hướng Pháp, nhưng Hồ Chí Minh sáng tạo bằng cách kết hợp yêu nước với chủ nghĩa xã hội, khắc phục khuynh hướng dân tộc hẹp hòi và giáo điều.'
        },
        {
            question: 'Trong tư tưởng Hồ Chí Minh, thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam có đặc điểm lớn nhất là gì?',
            options: [
                'Trải qua giai đoạn tư bản chủ nghĩa đầy đủ như các nước châu Âu.',
                'Từ một nước nông nghiệp lạc hậu tiến thẳng lên chủ nghĩa xã hội, không kinh qua tư bản chủ nghĩa.',
                'Chỉ tập trung vào kháng chiến mà không xây dựng kinh tế.',
                'Bỏ qua việc xây dựng con người mới xã hội chủ nghĩa.'
            ],
            correct: 1,
            explanation: 'Hồ Chí Minh nhận định đặc điểm to nhất là bỏ qua chế độ tư bản chủ nghĩa, phù hợp với thực tiễn Việt Nam thuộc địa nửa phong kiến, để rút ngắn con đường phát triển.'
        },
        {
            question: 'Ý nghĩa thực tiễn của việc vận dụng tư tưởng Hồ Chí Minh về độc lập dân tộc gắn liền với chủ nghĩa xã hội trong giai đoạn hiện nay là gì?',
            options: [
                'Trở lại mô hình kinh tế kế hoạch hóa tập trung hoàn toàn.',
                'Là cơ sở cho đổi mới, phát triển kinh tế thị trường định hướng xã hội chủ nghĩa và bảo vệ Tổ quốc.',
                'Chỉ áp dụng cho miền Bắc, không liên quan đến toàn quốc.',
                'Bỏ qua hội nhập quốc tế để tránh lệ thuộc.'
            ],
            correct: 1,
            explanation: 'Tư tưởng này giúp Việt Nam kiên định mục tiêu, kết hợp sức mạnh dân tộc với thời đại, đảm bảo phát triển bền vững và giữ vững độc lập tự chủ.'
        },
        {
            question: 'Theo Hồ Chí Minh, mối quan hệ giữa độc lập dân tộc và chủ nghĩa xã hội là gì?',
            options: [
                'Hai yếu tố độc lập, có thể tách rời nhau.',
                'Độc lập dân tộc là điều kiện tiên quyết cho chủ nghĩa xã hội, và chủ nghĩa xã hội bảo đảm độc lập vững chắc.',
                'Chủ nghĩa xã hội chỉ cần thiết sau khi có độc lập hình thức.',
                'Độc lập chỉ gắn với tự do cá nhân, không liên quan đến xã hội.'
            ],
            correct: 1,
            explanation: 'Hồ Chí Minh khẳng định quan hệ biện chứng: không có độc lập thì không xây dựng được xã hội chủ nghĩa, và chỉ xã hội chủ nghĩa mới đảm bảo độc lập thực chất, mang lại hạnh phúc cho nhân dân.'
        }
    ]

    const scrollToSection = (sectionId) => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    const handleQuizAnswer = (idx) => {
        setSelectedAnswer(idx)
        setShowAnswer(true)
    }

    const nextQuestion = () => {
        if (currentQuiz < quizQuestions.length - 1) {
            setCurrentQuiz(currentQuiz + 1)
            setSelectedAnswer(null)
            setShowAnswer(false)
        }
    }

    // Init mode preferences & reduced motion
    useEffect(() => {
        const stored = localStorage.getItem('theme-dark')
        if (stored === 'true') setDarkMode(true)
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        const applyRM = () => setReducedMotion(mq.matches)
        applyRM()
        mq.addEventListener('change', applyRM)
        return () => mq.removeEventListener('change', applyRM)
    }, [])

    const toggleDarkMode = () => {
        setDarkMode(d => {
            const v = !d
            localStorage.setItem('theme-dark', String(v))
            return v
        })
    }

    // Reveal on scroll
    useEffect(() => {
        document.documentElement.classList.add('js')
        const els = document.querySelectorAll('[data-reveal]')
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('is-visible')
                        io.unobserve(e.target)
                    }
                })
            },
            { threshold: 0.15 }
        )
        els.forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [])

    // Tilt effect for hero card
    useEffect(() => {
        if (reducedMotion) return
        const card = document.querySelector('.tilt-card')
        if (!card) return
        const handle = (e) => {
            const r = card.getBoundingClientRect()
            const x = e.clientX - r.left
            const y = e.clientY - r.top
            const rx = ((y / r.height) - 0.5) * -12
            const ry = ((x / r.width) - 0.5) * 14
            card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
        }
        const reset = () => (card.style.transform = 'rotateX(0deg) rotateY(0deg)')
        card.addEventListener('mousemove', handle)
        card.addEventListener('mouseleave', reset)
        return () => {
            card.removeEventListener('mousemove', handle)
            card.removeEventListener('mouseleave', reset)
        }
    }, [reducedMotion])

    // Observe international solidarity sub-blocks to highlight in local TOC
    useEffect(() => {
        const targets = document.querySelectorAll('#moi-quan-he [data-intl-topic]')
        if (!targets.length) return
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    setActiveIntlTopic(e.target.getAttribute('data-intl-topic'))
                }
            })
        }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 })
        targets.forEach(t => io.observe(t))
        return () => io.disconnect()
    }, [])

    // Unified scroll handler (progress + parallax + active section)
    useEffect(() => {
        let ticking = false
        const sectionIds = navItems.map(n => n.id)
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const y = window.scrollY || window.pageYOffset
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight
                    const prog = docHeight > 0 ? y / docHeight : 0
                    setScrollProgress(prog)
                    setShowBackTop(y > 600)
                    // Active section detection
                    let current = 'hero'
                    for (const id of sectionIds) {
                        const sec = document.getElementById(id)
                        if (!sec) continue
                        const top = sec.getBoundingClientRect().top + window.scrollY - 140 // offset for fixed nav
                        if (y >= top) current = id
                    }
                    setActiveSection(current)
                    ticking = false
                })
                ticking = true
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [reducedMotion, navItems])

    // Lazy load and autoplay timeline background video when timeline section visible
    useEffect(() => {
        if (reducedMotion) return
        const section = document.getElementById('timeline')
        if (!section) return
        const v = timelineVideoRef.current
        if (!v) return
        let loaded = false
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !loaded) {
                    loaded = true
                    // trigger load
                    v.load()
                    const playAttempt = v.play()
                    if (playAttempt && typeof playAttempt.then === 'function') {
                        playAttempt.catch(() => {/* ignore */ })
                    }
                    io.unobserve(section)
                }
            })
        }, { threshold: 0.25 })
        io.observe(section)
        return () => io.disconnect()
    }, [reducedMotion])

    // Lazy play hero video when in view (moved inside component)
    useEffect(() => {
        if (reducedMotion) return
        const vid = videoRef.current
        if (!vid) return
        let played = false
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !played) {
                    played = true
                    const p = vid.play()
                    if (p && typeof p.then === 'function') {
                        p.catch(() => {
                            setVideoFailed(true)
                        })
                    }
                    io.disconnect()
                }
            })
        }, { threshold: 0.25 })
        io.observe(vid)
        return () => io.disconnect()
    }, [reducedMotion])

    // Ensure video plays (no toggle now)
    useEffect(() => {
        if (reducedMotion || videoFailed) return
        const vid = videoRef.current
        if (!vid) return
        const p = vid.play()
        if (p && typeof p.then === 'function') p.catch(() => { })
    }, [reducedMotion, videoFailed])

    // Close intro overlay helper
    const closeIntro = () => {
        setShowIntro(false)
        const prev = lastFocusedRef.current
        if (prev && typeof prev.focus === 'function') prev.focus()
    }

    // Keyboard handling for dialog
    useEffect(() => {
        if (!showIntro) return
        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault(); closeIntro()
            }
        }
        window.addEventListener('keydown', keyHandler)
        // focus heading
        setTimeout(() => introHeadingRef.current?.focus(), 30)
        return () => window.removeEventListener('keydown', keyHandler)
    }, [showIntro])

    // Key listener to toggle international layout debug (Shift + D)
    useEffect(() => {
        const kb = (e) => {
            if (e.key.toLowerCase() === 'd' && e.shiftKey) {
                setIntlDebug(d => !d)
            }
        }
        window.addEventListener('keydown', kb)
        return () => window.removeEventListener('keydown', kb)
    }, [])

    return (
        <div className={`${darkMode ? 'theme-dark' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}>
            {/* Scroll progress bar */}
            <div id="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />

            <div className={`min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative transition-colors duration-500 ${darkMode ? 'dark-surface' : ''}`}>
                <div className="particle-layer">
                    <span className="p" />
                    <span className="p" />
                    <span className="p" />
                    <span className="p" />
                    <span className="p" />
                </div>

                {/* Nav */}
                <nav className={`fixed top-0 w-full z-50 bg-gradient-to-r from-red-800 to-red-900 border-b border-yellow-400/30 shadow-lg ${darkMode ? 'from-red-900 to-red-950' : ''}`}>
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo bên trái */}
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 text-yellow-300 hover:text-yellow-400 transition-colors"
                                aria-label="Tải lại trang"
                            >
                                <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                                    HCM202
                                </div>
                                <div className="h-6 w-px bg-yellow-400/50"></div>
                                <div className="text-sm font-semibold text-yellow-200">AI1807</div>
                            </button>

                            {/* Menu giữa */}
                            <div className="flex-1 max-w-3xl mx-8">
                                <ul className="flex items-center justify-center space-x-1">
                                    {navItems.map(item => {
                                        const shortLabel = item.label.includes('Thời kỳ quá độ') ? 'Thời kỳ quá độ' :
                                            item.label.includes('Mối quan hệ') ? 'Mối quan hệ' :
                                                item.label.includes('Câu hỏi suy ngẫm') ? 'Câu hỏi suy ngẫm' :
                                                    item.label.includes('Tính minh bạch AI') ? 'Minh bạch AI' :
                                                        item.label;

                                        return (
                                            <li key={item.id} className="relative">
                                                <button
                                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${activeSection === item.id
                                                        ? 'bg-yellow-400 text-black font-bold shadow-md'  
                                                        : 'text-yellow-200 hover:bg-yellow-400/20 hover:text-yellow-300'}`}
                                                    onClick={() => scrollToSection(item.id)}
                                                    aria-current={activeSection === item.id ? 'page' : undefined}
                                                    title={item.label}
                                                >
                                                    {shortLabel}
                                                    {activeSection === item.id && (
                                                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
                                                    )}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Bên phải */}
                            <div className="flex items-center gap-4">
                                <button
                                    aria-label="Chuyển chế độ sáng/tối"
                                    className="p-2 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 transition-colors"
                                    onClick={toggleDarkMode}
                                >
                                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </button>
                                <div className="hidden md:block px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border border-yellow-400/40 rounded-full text-yellow-300 text-sm font-bold tracking-wide">
                                    NHÓM SPST2
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero with background video only */}
                <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
                    {!reducedMotion && (
                        <div className="hero-bg-video-wrapper" aria-hidden="true">
                            <video
                                ref={videoRef}
                                className={`hero-bg-video ${videoCanPlay ? 'is-visible' : 'is-loading'}`}
                                loop
                                muted
                                playsInline
                                preload="none"
                                poster="/flag-poster.jpg"
                                onCanPlay={() => setVideoCanPlay(true)}
                                onError={() => setVideoFailed(true)}
                            >
                                <source src="/vn_flag.mp4" type="video/mp4" />
                            </video>
                            <div className="hero-bg-overlay" />
                        </div>
                    )}
                    <div className="container mx-auto px-6 xl:px-20 py-28 lg:py-32 relative z-10 w-full max-w-[1600px]">
                        <div className="hero-layout-final">
                            <div className="hero-text-block hero-text-block-final" data-reveal>
                                <h1 className="hero-heading-compact" aria-label="Tư tưởng Hồ Chí Minh về độc lập dân tộc và chủ nghĩa xã hội">
                                    TƯ TƯỞNG HỒ CHÍ MINH VỀ ĐỘC LẬP DÂN TỘC VÀ CHỦ NGHĨA XÃ HỘI
                                </h1>
                                <p className="hero-desc-compact" data-reveal>
                                    Khám phá tư tưởng cốt lõi của Chủ tịch Hồ Chí Minh về con đường cách mạng Việt Nam: độc lập dân tộc gắn liền với chủ nghĩa xã hội, phù hợp với điều kiện lịch sử và thực tiễn Việt Nam.
                                </p>
                                <div className="hero-actions" data-reveal>
                                    <Button size="lg" className="cta-primary" onClick={() => { lastFocusedRef.current = document.activeElement; setShowIntro(true) }}>
                                        <BookOpen className="h-5 w-5" /> KHÁM PHÁ NỘI DUNG
                                    </Button>
                                    <Button size="lg" variant="outline" className="cta-secondary" onClick={() => scrollToSection('timeline')}>
                                        <ArrowRight className="h-5 w-5 icon-shift" /> XEM HÀNH TRÌNH
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-center lg:justify-start" data-reveal>
                                <div className="chapter5-single-frame" aria-label="Chương 5: Tư tưởng Hồ Chí Minh về độc lập dân tộc và chủ nghĩa xã hội">
                                    <img
                                        src="/1.png"
                                        alt="Chương 5: Tư tưởng Hồ Chí Minh về độc lập dân tộc và chủ nghĩa xã hội"
                                        className="chapter5-image"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
                        <button
                            onClick={() => scrollToNextSection('hero')}
                            className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform"
                            aria-label="Chuyển đến section tiếp theo"
                        >
                            <ChevronDown className="w-8 h-8" />
                        </button>
                    </div>
                </section>
                {showIntro && (
                    <div className="intro-overlay" role="dialog" aria-modal="true" aria-labelledby="intro-heading" aria-describedby="intro-body">
                        <div className="intro-dialog">
                            <h3 id="intro-heading" ref={introHeadingRef} tabIndex={-1} className="intro-title">TỔNG QUAN</h3>
                            <div id="intro-body" className="intro-content">
                                <p>Tư tưởng Hồ Chí Minh về độc lập dân tộc và chủ nghĩa xã hội là kim chỉ nam cho sự nghiệp cách mạng Việt Nam. Từ truyền thống yêu nước, kiên cường chống ngoại xâm của dân tộc, Người phát triển thành quan điểm chiến lược: độc lập dân tộc phải gắn liền với chủ nghĩa xã hội để đảm bảo tự do, hạnh phúc thực sự cho nhân dân. Chuyên trang giúp người học tiếp cận hệ thống, có chứng cứ lịch sử - từ Cách mạng Tháng Tám, kháng chiến chống xâm lược đến công cuộc đổi mới - qua đó hiểu vì sao con đường độc lập dân tộc gắn liền với chủ nghĩa xã hội là sự lựa chọn tất yếu, đúng đắn, bảo đảm tương lai phồn vinh cho đất nước.</p>
                            </div>
                            <div className="intro-actions">
                                <Button size="sm" variant="outline" className="cta-secondary" onClick={closeIntro}>Đóng</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Timeline */}
                <section id="timeline" className="py-12 md:py-16 relative overflow-hidden timeline-section" data-reveal>
                    {/* Background video */}
                    {!reducedMotion && (
                        <div className={`timeline-video-wrapper ${timelineVideoCanPlay ? 'is-visible' : 'is-loading'}`} aria-hidden="true">
                            <video
                                ref={timelineVideoRef}
                                className="timeline-bg-video"
                                loop
                                muted
                                playsInline
                                preload="none"
                                poster="/flag-poster.jpg"
                                onCanPlay={() => setTimelineVideoCanPlay(true)}
                                onError={() => setTimelineVideoFailed(true)}
                            >
                                <source src="/hanh_trinh.mp4" type="video/mp4" />
                            </video>
                            <div className="timeline-video-overlay" />
                        </div>
                    )}
                    <div className="container mx-auto px-4 relative z-10">
                        <h2 className="text-4xl font-bold text-center text-yellow-300 mb-16">HÀNH TRÌNH TƯ TƯỞNG ĐỘC LẬP DÂN TỘC GẮN LIỀN VỚI CHỦ NGHĨA XÃ HỘI</h2>
                        <div className="relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-yellow-400" />
                            <div className="space-y-6 md:space-y-10">
                                {[
                                    { year: '1930', event: 'Hồ Chí Minh xác định con đường cách mạng Việt Nam', description: 'Giải phóng dân tộc gắn liền với chủ nghĩa xã hội.' },
                                    { year: '1945', event: 'Cách mạng Tháng Tám thành công', description: 'Giành độc lập dân tộc, mở đầu thời kỳ quá độ lên CNXH.' },
                                    { year: '1945--1954', event: 'Thời kỳ quá độ trong kháng chiến', description: 'Vừa kháng chiến, vừa xây dựng chế độ mới.' },
                                    { year: '1954', event: 'Miền Bắc bước vào quá độ lên CNXH', description: 'Xây dựng CNXH, làm cơ sở bảo vệ và củng cố độc lập.' },
                                    { year: '1960', event: 'Hồ Chí Minh khẳng định vai trò CNXH', description: 'Chỉ CNXH mới bảo đảm độc lập dân tộc vững chắc.' },
                                    { year: '1991', event: 'Đảng ban hành Cương lĩnh thời kỳ quá độ', description: 'Kiên định độc lập dân tộc gắn liền với CNXH.' },
                                    { year: '2011', event: 'Bổ sung, phát triển Cương lĩnh', description: 'Làm rõ mô hình CNXH Việt Nam trong thời kỳ đổi mới.' },
                                    { year: 'Hiện nay', event: 'Vận dụng tư tưởng Hồ Chí Minh', description: 'Giữ vững độc lập dân tộc, phát triển đất nước theo định hướng CNXH.' }
                                ].map((item, index) => (
                                    <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-6 md:pr-8' : 'text-left pl-6 md:pl-8'}`}>
                                            <Card className="bg-yellow-50 border-yellow-400 shadow-lg hover:shadow-xl transition-shadow timeline-card compact">
                                                <CardHeader className="py-3 px-4 pb-2">
                                                    <CardTitle className="text-red-800 text-lg md:text-xl leading-tight">{item.year}</CardTitle>
                                                    <CardDescription className="text-red-700 font-semibold text-sm md:text-base leading-snug">{item.event}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="pt-0 pb-3 px-4">
                                                    <p className="text-red-600 text-sm md:text-[15px] leading-snug">{item.description}</p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full border-4 border-red-800" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nút mũi tên xuống ở giữa bên phải */}
                        <div className="absolute bottom-4 right-8 animate-bounce">
                            <button
                                onClick={() => scrollToNextSection('timeline')}
                                className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform"
                                aria-label="Chuyển đến section tiếp theo"
                            >
                                <ChevronDown className="w-8 h-8" />
                            </button>
                        </div>

                    </div>
                </section>

                {/* 5.1 Section: Thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam */}
                <section id="thoi-ky-qua-do" className="min-h-screen bg-gradient-to-br from-red-700 via-red-800 to-red-900 relative overflow-hidden">
                    {/* Video nền */}
                    <video
                        className="absolute inset-0 w-full h-full object-cover opacity-15"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="/5.1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Overlay để làm sẫm video */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-5"></div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 z-10">
                        <div className="absolute inset-0 bg-repeat opacity-30" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd770' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>
                    </div>

                    <div className="relative z-20 container mx-auto px-8 py-20">
                        {/* Tiêu đề chính */}
                        <div className="text-center mb-20">
                            <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-4 tracking-wide">
                                THỜI KỲ QUÁ ĐỘ LÊN CHỦ NGHĨA XÃ HỘI Ở VIỆT NAM
                            </h1>
                            <div className="w-32 h-1 bg-yellow-400 mx-auto mt-6"></div>
                        </div>

                        {/* Content Layout - Hiệu ứng nhẹ nhàng, bố trí gọn */}
                        <div className="relative max-w-6xl mx-auto min-h-[600px] px-6">

                            {/* VAI TRÒ - Top, chữ bên trái */}
                            <div className="absolute top-30 left-0">
                                <div className="flex items-center gap-10">
                                    <div className="w-[360px]">
                                        <h3 className="text-4xl font-bold text-yellow-400 mb-4" style={{ textAlign: 'right' }}>VAI TRÒ</h3>
                                        <p className="text-white text-base leading-8" style={{ textAlign: 'right', lineHeight: '1.5' }}>
                                            Thời kỳ quá độ là giai đoạn tất yếu để chuyển từ xã hội cũ sang xã hội xã hội chủ nghĩa, quyết định việc xây dựng xã hội mới ở Việt Nam, nơi phải khắc phục tình trạng nông nghiệp lạc hậu và di sản thuộc địa.
                                        </p>
                                    </div>
                                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-yellow-400 hover:scale-105 transition-all duration-300 flex-shrink-0 animate-float">
                                        <img src="/5.1.1.png" alt="Vai trò" className="w-full h-full object-cover scale-125" />
                                    </div>
                                </div>
                            </div>

                            {/* TÍNH CHẤT - Middle right, chữ bên phải */}
                            <div className="absolute top-[138px] right-[-30px]">
                                <div className="flex items-center gap-10 flex-row-reverse">
                                    <div className="w-[320px]">
                                        <h3 className="text-4xl font-bold text-yellow-400 mb-4" style={{ textAlign: 'left' }}>TÍNH CHẤT</h3>
                                        <p className="text-white text-base leading-7" style={{ textAlign: 'left', lineHeight: '1.5' }}>
                                            Là thời kỳ cải biến sâu sắc, lâu dài và phức tạp trên mọi lĩnh vực của đời sống xã hội, đòi hỏi đấu tranh gian khổ để thay đổi nếp sống, thói quen và thành kiến hàng ngàn năm, không thể nóng vội mà phải tiến hành dần dần.
                                        </p>
                                    </div>
                                    <div className="w-56 h-56 rounded-full overflow-hidden shadow-xl border-3 border-yellow-400 hover:scale-105 transition-all duration-300 flex-shrink-0 animate-float-delay">
                                        <img src="/5.1.2.png" alt="Tính chất" className="w-full h-full object-cover scale-125" />
                                    </div>
                                </div>
                            </div>

                            {/* ĐẶC ĐIỂM CƠ BẢN - Middle left, chữ bên trái */}
                            <div className="absolute top-[280px] left-[-150px]">
                                <div className="flex items-center gap-14">
                                    <div className="w-[420px]">
                                        <h3 className="text-3xl font-bold text-yellow-400 mb-4" style={{ textAlign: 'right' }}>ĐẶC ĐIỂM CƠ BẢN</h3>
                                        <div className="text-white text-base leading-7 space-y-2" style={{ textAlign: 'right', lineHeight: '1.5' }}>
                                            <p>Tồn tại đan xen giữa yếu tố cũ và yếu tố mới, đòi hỏi vừa xây dựng vừa cải tạo xã hội, trong điều kiện xuất phát điểm thấp, chịu nhiều tác động quốc tế, đặc biệt là từ một nước nông nghiệp lạc hậu tiến thẳng lên chủ nghĩa xã hội mà không trải qua giai đoạn tư bản chủ nghĩa.</p>
                                        </div>
                                    </div>
                                    <div className="w-56 h-56 rounded-full overflow-hidden shadow-xl border-4 border-yellow-400 hover:scale-105 transition-all duration-300 flex-shrink-0 animate-float-slow">
                                        <img src="/5.1.3.png" alt="Đặc điểm cơ bản" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>

                            {/* NHIỆM VỤ TRUNG TÂM - Bottom right, chữ bên phải */}
                            <div className="absolute bottom-0 right-[-205px]">
                                <div className="flex items-center gap-9 flex-row-reverse">
                                    <div className="w-[480px]">
                                        <h3 className="text-4xl font-bold text-yellow-400 mb-6" style={{ textAlign: 'left' }}>NHIỆM VỤ TRUNG TÂM</h3>
                                        <div className="text-white text-base leading-7 space-y-3" style={{ textAlign: 'left', lineHeight: '1.6' }}>
                                            <p>Phát triển lực lượng sản xuất, xây dựng nền kinh tế mới với công nghiệp và nông nghiệp hiện đại làm nền tảng vật chất; xây dựng Nhà nước của dân, do dân, vì dân để đảm bảo dân chủ; và xây dựng con người mới xã hội chủ nghĩa, triệt để tẩy trừ di tích thuộc địa, phát triển văn hóa dân tộc, khoa học và đại chúng.</p>
                                        </div>
                                    </div>
                                    <div className="w-52 h-52 rounded-full overflow-hidden shadow-xl border-4 border-yellow-400 hover:scale-105 transition-all duration-300 flex-shrink-0 animate-float-gentle">
                                        <img src="/5.1.4.png" alt="Nhiệm vụ trung tâm" className="w-full h-full object-cover scale-125" />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Nút mũi tên xuống để chuyển section */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                            <button
                                onClick={() => scrollToNextSection('thoi-ky-qua-do')}
                                className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform"
                                aria-label="Chuyển đến section tiếp theo"
                            >
                                <ChevronDown className="w-8 h-8" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* 5.2 Section: Mối quan hệ giữa độc lập dân tộc và chủ nghĩa xã hội */}
                <section id="moi-quan-he" className="relative overflow-hidden bg-red-900 py-20 min-h-[1400px]">
                    {/* Video nền */}
                    <video
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                    >
                        <source src="/5.2.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Overlay để làm sẫm video */}
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                    {/* Tiêu đề */}
                    <div className="relative z-10 text-center mb-12">
                        <h2 className="text-5xl font-bold text-yellow-400 uppercase mb-4 tracking-wide">
                            MỐI QUAN HỆ GIỮA ĐỘC LẬP DÂN TỘC VÀ CHỦ NGHĨA XÃ HỘI
                        </h2>
                        <p className="text-white text-lg opacity-90">
                            Vị trí – Ý nghĩa • Nội dung mối quan hệ • Giá trị lý luận
                        </p>
                        <div className="w-32 h-1 bg-yellow-400 mx-auto mt-6"></div>
                    </div>

                    {/* Container */}
                    <div className="relative z-10 max-w-7xl mx-auto px-8 min-h-[1200px]">

                        {/* BEN TRAI - 2 MUC (layout động) */}

                        {/* 1. Vị trí – Ý nghĩa */}
                        <div className="absolute top-[150px] left-[-50px] flex items-center gap-10">
                            <div className="w-56 h-56 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 flex-shrink-0 hover:scale-105 transition-all duration-500 animate-float">
                                <img
                                    src="/5.2.1.png"
                                    alt="Vị trí ý nghĩa"
                                    className="w-full h-full object-cover scale-110 transform hover:scale-125 transition-transform duration-300"
                                />
                            </div>
                            <div className="w-[450px] text-left">
                                <h3 className="text-4xl font-bold text-yellow-300 mb-5">Vị trí – Ý nghĩa</h3>
                                <p className="text-white leading-9 text-xl mb-4">
                                    Độc lập dân tộc và chủ nghĩa xã hội có quan hệ biện chứng, thống nhất, không thể tách rời, là nội dung cốt lõi trong tư tưởng Hồ Chí Minh về con đường cách mạng Việt Nam, đảm bảo giải phóng dân tộc dẫn đến giải phóng xã hội và con người.
                                </p>
                            </div>
                        </div>

                        {/* 2. Nội dung mối quan hệ */}
                        <div className="absolute top-[580px] left-[30px] flex items-center gap-8">
                            <div className="w-44 h-44 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 flex-shrink-0 hover:scale-105 transition-all duration-500 animate-float-delay">
                                <img
                                    src="/5.2.2.png"
                                    alt="Nội dung mối quan hệ"
                                    className="w-full h-full object-cover scale-110 transform hover:scale-125 transition-transform duration-300"
                                />
                            </div>
                            <div className="w-[480px] text-left">
                                <h3 className="text-3xl font-bold text-yellow-300 mb-4">Nội dung mối quan hệ</h3>
                                <ul className="list-none text-white space-y-3 text-lg">
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-xl">•</span>
                                        <span>Độc lập dân tộc là điều kiện tiên quyết để xây dựng CNXH, vì không có độc lập thì không thể tiến hành cải tạo xã hội</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-xl">•</span>
                                        <span>Ngược lại, CNXH là cơ sở bảo đảm nền độc lập dân tộc vững chắc, tránh lệ thuộc và đảm bảo tự do, hạnh phúc của nhân dân lao động</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* BEN PHAI - 4 MUC (layout tự nhiên hơn) */}

                        {/* 3. Giá trị lý luận */}
                        <div className="absolute top-[50px] right-[-40px] flex items-center gap-12">
                            <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 flex-shrink-0 hover:scale-105 transition-all duration-500 animate-float-slow">
                                <img
                                    src="/5.2.3.png"
                                    alt="Giá trị lý luận"
                                    className="w-full h-full object-cover scale-110 transform hover:scale-125 transition-transform duration-300"
                                />
                            </div>
                            <div className="w-[400px] text-left">
                                <h3 className="text-3xl font-bold text-yellow-300 mb-4">Giá trị lý luận</h3>
                                <ul className="list-none text-white space-y-2 text-lg">
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-lg">•</span>
                                        <span>Vận dụng sáng tạo chủ nghĩa Mác -- Lênin vào thực tiễn Việt Nam</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-lg">•</span>
                                        <span>Khắc phục khuynh hướng dân tộc hẹp hòi và giáo điều máy móc</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-lg">•</span>
                                        <span>Bằng cách kết hợp yêu nước với quốc tế vô sản, phù hợp với điều kiện thuộc địa nửa phong kiến</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 4. Vận dụng hiện nay: Nội dung vận dụng */}
                        <div className="absolute top-[380px] right-[20px] flex items-center gap-9">
                            <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 flex-shrink-0 hover:scale-105 transition-all duration-500 animate-float-gentle">
                                <img
                                    src="/5.2.4.png"
                                    alt="Nội dung vận dụng"
                                    className="w-full h-full object-cover scale-100 transform hover:scale-115 transition-transform duration-300"
                                />
                            </div>
                            <div className="w-[420px] text-left">
                                <h3 className="text-4xl font-bold text-yellow-300 mb-5">Nội dung vận dụng</h3>
                                <ul className="list-none text-white space-y-3 text-xl">
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-xl">•</span>
                                        <span>Kiên định mục tiêu độc lập dân tộc và chủ nghĩa xã hội</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-xl">•</span>
                                        <span>Phát triển kinh tế thị trường định hướng xã hội chủ nghĩa để nâng cao đời sống nhân dân</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-xl">•</span>
                                        <span>Chủ động hội nhập quốc tế gắn với giữ vững độc lập, tự chủ, tránh lệ thuộc vào các thế lực bên ngoài</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 5. Vận dụng hiện nay: Nguyên tắc thực hiện */}
                        <div className="absolute top-[720px] right-[-60px] flex items-center gap-7">
                            <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 flex-shrink-0 hover:scale-105 transition-all duration-500 animate-float">
                                <img
                                    src="/5.2.5.png"
                                    alt="Nguyên tắc thực hiện"
                                    className="w-full h-full object-cover scale-110 transform hover:scale-125 transition-transform duration-300"
                                />
                            </div>
                            <div className="w-[460px] text-left">
                                <h3 className="text-3xl font-bold text-yellow-300 mb-4">Nguyên tắc thực hiện</h3>
                                <ul className="list-none text-white space-y-2 text-lg">
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-lg">•</span>
                                        <span>Giữ vững độc lập, tự chủ trong đường lối phát triển, không rập khuôn máy móc</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-lg">•</span>
                                        <span>Kết hợp sức mạnh dân tộc với sức mạnh thời đại qua đoàn kết quốc tế</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-4 text-yellow-400 text-lg">•</span>
                                        <span>Lấy lợi ích của nhân dân làm mục tiêu cao nhất, đảm bảo công bằng xã hội và hạnh phúc thực sự</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 6. Vận dụng hiện nay: Ý nghĩa thực tiễn - LEFT SIDE */}
                        <div className="absolute top-[900px] left-[30px] flex items-center gap-8">
                            <div className="w-44 h-44 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 flex-shrink-0 hover:scale-105 transition-all duration-500 animate-float-delay">
                                <img
                                    src="/5.2.6.png"
                                    alt="Ý nghĩa thực tiễn"
                                    className="w-full h-full object-cover scale-110 transform hover:scale-125 transition-transform duration-300"
                                />
                            </div>
                            <div className="w-[480px] text-left">
                                <h3 className="text-3xl font-bold text-yellow-300 mb-4">Ý nghĩa thực tiễn</h3>
                                <p className="text-white text-lg leading-7">
                                    Là cơ sở tư tưởng cho sự nghiệp đổi mới, phát triển bền vững và bảo vệ Tổ quốc Việt Nam xã hội chủ nghĩa, giúp vượt qua thách thức toàn cầu hóa, duy trì ổn định và tiến bộ xã hội.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Nút mũi tên xuống để chuyển section */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <button
                            onClick={() => scrollToNextSection('moi-quan-he')}
                            className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform"
                            aria-label="Chuyển đến section tiếp theo"
                        >
                            <ChevronDown className="w-8 h-8" />
                        </button>
                    </div>
                </section>

                {/* === SECTION VIDEO GIẢI THÍCH === */}
                <section id="video-giang-giai" className="py-16 bg-gradient-to-b from-red-900/90 to-black/90 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-repeat" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23fbbf24' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                            backgroundSize: '400px'
                        }}></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-3 mb-4 px-6 py-2 bg-yellow-400/10 backdrop-blur-sm rounded-full border border-yellow-400/30">
                                <span className="text-2xl">🎬</span>
                                <span className="text-yellow-300 font-bold text-lg tracking-wide">VIDEO GIẢNG GIẢI TRỰC QUAN</span>
                                <span className="text-2xl">📽️</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
                                SO SÁNH TƯ TƯỞNG ĐỘC LẬP DÂN TỘC
                            </h2>
                            <p className="text-xl text-white/90 max-w-3xl mx-auto">
                                Phan Bội Châu • Phan Châu Trinh • Hồ Chí Minh - 3 con đường, 1 lựa chọn lịch sử
                            </p>
                            <div className="w-40 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 mx-auto mt-6 rounded-full"></div>
                        </div>

                        {/* PHẦN GIỚI THIỆU MỚI - FLEXBOX ĐỒNG BỘ */}
                        <div className="max-w-5xl mx-auto mb-12">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-yellow-400 mb-2">Tại Sao Tư Tưởng Hồ Chí Minh Là Đột Phá?</h2>
                                <div className="w-48 h-1 bg-gradient-to-r from-yellow-400 to-red-600 mx-auto rounded-full"></div>
                            </div>

                            <div className="bg-gradient-to-b from-yellow-50/10 to-red-900/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-yellow-400/30">
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-bold text-yellow-300 mb-4">
                                        Để Hiểu Sự Đột Phá Trong Tư Tưởng Hồ Chí Minh
                                    </h3>
                                    <p className="text-white/90 text-xl mb-6 max-w-3xl mx-auto">
                                        Chúng ta cần so sánh với các nhà yêu nước tiền bối.
                                        Video dưới đây sẽ phân tích 3 con đường khác nhau trong lịch sử Việt Nam:
                                    </p>
                                </div>

                                {/* === FIXED: CHUYỂN TỪ GRID SANG FLEXBOX === */}
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Phan Bội Châu */}
                                    <div className="group relative flex-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-800/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                        <div className="relative bg-gradient-to-b from-red-50/10 to-red-900/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-red-400/30 group-hover:border-red-400/60 transition-all duration-300 group-hover:scale-[1.02] h-full">
                                            <div className="flex flex-col items-center text-center h-full">
                                                <div className="relative mb-4">
                                                    <div className="absolute inset-0 bg-red-400/20 rounded-full blur-md"></div>
                                                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl">
                                                        <span className="text-white text-2xl">🇯🇵</span>
                                                    </div>
                                                </div>

                                                <h4 className="text-2xl font-bold text-red-300 mb-3">Phan Bội Châu</h4>

                                                <div className="bg-red-900/40 rounded-xl p-3 w-full mb-4">
                                                    <span className="text-yellow-200/80 text-sm">Con Đường</span>
                                                    <p className="text-yellow-400 font-bold mt-1">Dựa Vào Ngoại Bang</p>
                                                </div>

                                                <p className="text-white/80 text-center leading-relaxed mb-4">
                                                    Chủ trương "Đông Du", dựa vào Nhật Bản để đánh Pháp
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-red-400/20 w-full text-center">
                                                    <span className="text-red-300/70 text-sm">• Cầu viện ngoại bang •</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phan Châu Trinh */}
                                    <div className="group relative flex-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-700/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                        <div className="relative bg-gradient-to-b from-yellow-50/10 to-orange-900/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-400/30 group-hover:border-yellow-400/60 transition-all duration-300 group-hover:scale-[1.02] h-full">
                                            <div className="flex flex-col items-center text-center h-full">
                                                <div className="relative mb-4">
                                                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md"></div>
                                                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-2xl">
                                                        <span className="text-white text-2xl">📚</span>
                                                    </div>
                                                </div>

                                                <h4 className="text-2xl font-bold text-yellow-300 mb-3">Phan Châu Trinh</h4>

                                                <div className="bg-orange-900/40 rounded-xl p-3 w-full mb-4">
                                                    <span className="text-yellow-200/80 text-sm">Con Đường</span>
                                                    <p className="text-yellow-400 font-bold mt-1">Cải Cách Ôn Hòa</p>
                                                </div>

                                                <p className="text-white/80 text-center leading-relaxed mb-4">
                                                    Đề cao "Khai dân trí", cải cách trong khuôn khổ thuộc địa
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-yellow-400/20 w-full text-center">
                                                    <span className="text-yellow-300/70 text-sm">• Duy tân • Khai hóa •</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hồ Chí Minh - HIGHLIGHTED */}
                                    <div className="group relative flex-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-red-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                        <div className="relative bg-gradient-to-b from-yellow-100/10 to-red-900/40 backdrop-blur-lg rounded-2xl p-6 border-3 border-yellow-400 group-hover:border-yellow-300 transition-all duration-300 group-hover:scale-[1.02] h-full shadow-xl">
                                            <div className="flex flex-col items-center text-center h-full">
                                                <div className="relative mb-4">
                                                    <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-md"></div>
                                                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl">
                                                        <span className="text-white text-2xl">⭐</span>
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold text-white px-2 py-1 rounded-full">
                                                        ĐỘT PHÁ
                                                    </div>
                                                </div>

                                                <h4 className="text-2xl font-bold text-yellow-400 mb-3">Hồ Chí Minh</h4>

                                                <div className="bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-xl p-3 w-full mb-4 border border-yellow-400/30">
                                                    <span className="text-yellow-200 text-sm">Con Đường Cách Mạng</span>
                                                    <p className="text-yellow-300 font-bold mt-1">Độc Lập + CNXH</p>
                                                </div>

                                                <p className="text-white font-medium text-center leading-relaxed mb-4">
                                                    Độc lập dân tộc phải đi đôi với chủ nghĩa xã hội
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-yellow-400/30 w-full text-center">
                                                    <span className="text-yellow-400 text-sm font-semibold">• Cách mạng triệt để •</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* === END FLEXBOX FIX === */}

                                {/* TIMELINE INDICATOR - GIỮ NGUYÊN */}
                                <div className="flex items-center justify-center mt-8 pt-6 border-t border-yellow-400/20">
                                    <div className="text-center">
                                        <p className="text-white/80 text-lg mb-3">
                                            <span className="text-yellow-300 font-bold">Mỗi con đường</span> thể hiện một cách tiếp cận khác biệt
                                            trong bối cảnh lịch sử đầu thế kỷ XX
                                        </p>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <div className="text-sm text-yellow-300/80">Độc lập hình thức</div>
                                            <div className="w-16 h-1 bg-gradient-to-r from-yellow-400/40 to-yellow-400 rounded-full"></div>
                                            <div className="text-sm font-bold text-yellow-400 px-2">→ BƯỚC NHẢY ←</div>
                                            <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                                            <div className="text-sm text-yellow-300">Độc lập thực chất</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MAIN VIDEO CONTAINER - CENTERED */}
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-gradient-to-br from-black/60 to-red-900/40 backdrop-blur-sm rounded-3xl p-2 md:p-3 border-2 border-yellow-400/30 shadow-2xl">
                                <div className="aspect-video rounded-2xl overflow-hidden border border-yellow-400/20 bg-black">
                                    <video
                                        className="w-full h-full object-cover"
                                        controls
                                        autoPlay={false}
                                        muted={false}
                                        playsInline
                                        preload="metadata"
                                        title="So sánh tư tưởng độc lập dân tộc: Phan Bội Châu, Phan Châu Trinh vs Hồ Chí Minh"
                                    >
                                        <source src="/6.0.mp4" type="video/mp4" />
                                        Trình duyệt của bạn không hỗ trợ thẻ video.
                                    </video>
                                </div>
                            </div>

                            {/* 3-COLUMN FLEXBOX - UPGRADED PREMIUM DESIGN */}
                            <div className="mt-12">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-yellow-400 mb-2">Thông Tin Video</h2>
                                    <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-red-600 mx-auto rounded-full"></div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto px-4">
                                    {/* Thời lượng - Enhanced */}
                                    <div className="group relative flex-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-red-800/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                        <div className="relative bg-gradient-to-b from-yellow-50/10 to-red-900/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-yellow-400/30 group-hover:border-yellow-400/60 transition-all duration-300 group-hover:scale-[1.02] h-full">
                                            <div className="flex flex-col items-center h-full">
                                                <div className="relative mb-6">
                                                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md"></div>
                                                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl">
                                                        <span className="text-white text-3xl">⏱️</span>
                                                    </div>
                                                </div>

                                                <h4 className="text-2xl font-bold text-yellow-300 mb-4">Thời Lượng</h4>

                                                <div className="bg-red-900/40 rounded-xl p-4 w-full mb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-yellow-200/80 text-sm">Thời lượng video</span>
                                                        <span className="text-yellow-400 font-bold">1 phút 20s</span>
                                                    </div>
                                                    <div className="w-full bg-red-800/40 rounded-full h-2">
                                                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full w-3/4"></div>
                                                    </div>
                                                </div>

                                                <p className="text-white/90 text-center text-lg leading-relaxed mt-auto">
                                                    Video giải thích trực quan, dễ hiểu, tối ưu cho việc học tập
                                                </p>

                                                <div className="mt-6 pt-4 border-t border-yellow-400/20 w-full text-center">
                                                    <span className="text-yellow-300/70 text-sm">• Tối ưu tiếp thu • Trực quan • Hiệu quả</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nội dung - Enhanced */}
                                    <div className="group relative flex-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-800/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                        <div className="relative bg-gradient-to-b from-red-50/10 to-red-900/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-red-400/30 group-hover:border-red-400/60 transition-all duration-300 group-hover:scale-[1.02] h-full">
                                            <div className="flex flex-col items-center h-full">
                                                <div className="relative mb-6">
                                                    <div className="absolute inset-0 bg-red-400/20 rounded-full blur-md"></div>
                                                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl">
                                                        <span className="text-white text-3xl">🎯</span>
                                                    </div>
                                                </div>

                                                <h4 className="text-2xl font-bold text-red-300 mb-4">Nội Dung</h4>

                                                <div className="space-y-3 w-full mb-6">
                                                    <div className="flex items-center gap-3 bg-red-900/40 p-3 rounded-lg">
                                                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                                            <span className="text-yellow-400 text-lg">1</span>
                                                        </div>
                                                        <span className="text-white/90">So sánh 3 quan điểm yêu nước</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-red-900/40 p-3 rounded-lg">
                                                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                                            <span className="text-yellow-400 text-lg">2</span>
                                                        </div>
                                                        <span className="text-white/90">Phân tích tư tưởng Hồ Chí Minh</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-red-900/40 p-3 rounded-lg">
                                                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                                            <span className="text-yellow-400 text-lg">3</span>
                                                        </div>
                                                        <span className="text-white/90">Bài học lịch sử trực quan</span>
                                                    </div>
                                                </div>

                                                <p className="text-white/90 text-center text-lg leading-relaxed mt-auto">
                                                    Phân tích sâu, so sánh đa chiều các quan điểm lịch sử
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nguồn - Enhanced */}
                                    <div className="group relative flex-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-red-800/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                        <div className="relative bg-gradient-to-b from-yellow-50/10 to-red-900/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-yellow-400/30 group-hover:border-yellow-400/60 transition-all duration-300 group-hover:scale-[1.02] h-full">
                                            <div className="flex flex-col items-center h-full">
                                                <div className="relative mb-6">
                                                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md"></div>
                                                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-2xl">
                                                        <span className="text-white text-3xl">📁</span>
                                                    </div>
                                                </div>

                                                <h4 className="text-2xl font-bold text-yellow-300 mb-4">Nguồn</h4>

                                                <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-xl p-5 w-full mb-6 border border-yellow-400/20">
                                                    <div className="text-center">
                                                        {/* CHỈNH SỬA TẠI ĐÂY */}
                                                        <p className="text-yellow-300 font-bold text-lg mb-1">HCM202</p>
                                                        <p className="text-white/80 text-sm">Môn: Tư tưởng Hồ Chí Minh</p>
                                                        {/* HOẶC: */}
                                                        {/* <p className="text-yellow-300 font-bold text-lg mb-1">Tư tưởng HCM</p>
                    <p className="text-white/80 text-sm">Mã môn học: HCM202</p> */}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 w-full mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                                        <span className="text-white/80 text-sm">Video bài giảng nội bộ</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                                        <span className="text-white/80 text-sm">Tài liệu học tập chính thức</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                                        <span className="text-white/80 text-sm">Nội dung đã được kiểm duyệt</span>
                                                    </div>
                                                </div>

                                                <p className="text-white/90 text-center text-lg leading-relaxed mt-auto">
                                                    Tài liệu chất lượng cao dành cho giáo dục
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM SECTION - 4-POINT CHECKLIST - SINGLE COLUMN CENTERED */}
                            <div className="mt-10 flex justify-center">
                                <div className="bg-gradient-to-r from-red-800/40 to-red-900/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/20 max-w-3xl w-full">
                                    <h4 className="text-yellow-300 font-bold text-xl mb-6 text-center">
                                        <span className="text-2xl mr-3">📚</span>
                                        Bạn sẽ hiểu rõ sau video:
                                    </h4>

                                    {/* 4-POINT LIST - CENTERED */}
                                    <div className="space-y-4 max-w-2xl mx-auto text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-yellow-400 text-xl flex-shrink-0">✓</span>
                                            <span className="text-white">Sự khác biệt giữa "độc lập hình thức" và "độc lập thực chất"</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-yellow-400 text-xl flex-shrink-0">✓</span>
                                            <span className="text-white">Tại sao Hồ Chí Minh chọn con đường độc lập + CNXH</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-yellow-400 text-xl flex-shrink-0">✓</span>
                                            <span className="text-white">Cách Hồ Chí Minh kế thừa &amp; sáng tạo từ tiền nhân</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-yellow-400 text-xl flex-shrink-0">✓</span>
                                            <span className="text-white">Giá trị lịch sử của tư tưởng Hồ Chí Minh ngày nay</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CHEVRON DOWN BUTTON */}
                        <div className="text-center mt-12">
                            <button
                                onClick={() => scrollToNextSection('video-giang-giai')}
                                className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform"
                                aria-label="Chuyển đến phần tiếp theo"
                            >
                                <ChevronDown className="w-8 h-8 mx-auto" />
                            </button>
                        </div>
                    </div>
                </section>



                {/* Section: Câu hỏi suy ngẫm - ĐẦY ĐỦ BACKGROUND */}
                <section id="cau-hoi-suy-ngam" className="min-h-screen bg-gradient-to-br from-red-700 via-red-800 to-red-900 relative overflow-hidden py-16">
                    {/* === 1. VIDEO BACKGROUND - ĐÃ THÊM LẠI === */}
                    <video
                        className="absolute inset-0 w-full h-full object-cover opacity-15"  // Change from opacity-30 to opacity-15
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="/5.1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* === 2. VIDEO OVERLAY - Làm tối video === */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-5"></div>

                    {/* === 3. PATTERN BACKGROUND ĐỘNG === */}
                    <div className="absolute inset-0 opacity-15 z-10">
                        <div className="absolute inset-0 bg-repeat opacity-20" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd770' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>
                    </div>

                    {/* === 4. ANIMATED GRADIENT OVERLAY === */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-red-600/3 animate-pulse z-10"></div>

                    {/* === NỘI DUNG CHÍNH === */}
                    <div className="relative z-20 container mx-auto px-4">
                        {/* Tiêu đề chính - UPGRADED */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-3 mb-4 px-6 py-2 bg-yellow-400/10 backdrop-blur-sm rounded-full border border-yellow-400/30">
                                <span className="text-2xl">🤔</span>
                                <span className="text-yellow-300 font-bold text-lg tracking-wide">CÂU HỎI SUY NGẪM</span>
                                <span className="text-2xl">💭</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4 tracking-tight">
                                Khám Phá Chiều Sâu Tư Tưởng Hồ Chí Minh
                            </h1>
                            <p className="text-xl text-white/90 max-w-3xl mx-auto">
                                Phân tích sự đột phá trong quan niệm về độc lập dân tộc qua các thời kỳ lịch sử
                            </p>
                            <div className="w-40 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 mx-auto mt-6 rounded-full"></div>
                        </div>

                        {/* Main Content - UPGRADED WITH FLEXBOX */}
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-gradient-to-br from-black/60 to-red-900/40 backdrop-blur-lg rounded-3xl p-2 border-2 border-yellow-400/30 shadow-2xl">
                                <div className="bg-gradient-to-b from-red-900/20 to-black/40 rounded-2xl p-8 border border-yellow-400/20">

                                    {/* Question Section - FLEXBOX LAYOUT */}
                                    <div className="mb-10">
                                        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                                            {/* Question Icon */}
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full w-14 h-14 flex items-center justify-center text-2xl font-black shadow-lg">
                                                    ?
                                                </div>
                                            </div>

                                            {/* Question Content */}
                                            <div className="flex-1">
                                                <div className="mb-4">
                                                    <h4 className="text-yellow-300 font-bold text-2xl mb-3 flex items-center gap-3">
                                                        <span className="text-3xl">🎯</span>
                                                        Câu hỏi thảo luận trọng tâm:
                                                    </h4>
                                                </div>

                                                <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-xl p-6 border-l-4 border-yellow-400">
                                                    <p className="text-white text-xl leading-relaxed font-medium">
                                                        <span className="text-yellow-300 font-bold">"Quan niệm độc lập dân tộc của Hồ Chí Minh khác biệt như thế nào</span>
                                                        <br />
                                                        <span className="text-white">so với các tiền nhân như Lê Lợi hay Phan Bội Châu,</span>
                                                        <br />
                                                        <span className="text-yellow-400 font-bold">đặc biệt trong việc gắn kết với chủ nghĩa xã hội</span>
                                                        <br />
                                                        <span className="text-white">để đảm bảo hạnh phúc thực sự cho nhân dân lao động?"</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Connection to Previous Video */}
                                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/20 mb-8">
                                            <div className="flex items-center gap-3">
                                                <span className="text-blue-400 text-2xl">📺</span>
                                                <div>
                                                    <p className="text-white/90 font-medium">
                                                        <span className="text-blue-300">Đã xem video so sánh 3 con đường yêu nước?</span>
                                                        <br />
                                                        <span className="text-white/70 text-sm">Video trước đã phân tích 3 quan điểm khác nhau.
                                                            Bây giờ hãy cùng suy ngẫm sâu hơn về bản chất của sự khác biệt này.</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thinking Hints - FLEXBOX GRID */}
                                    <div className="mb-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="text-3xl">💡</span>
                                            <h5 className="text-yellow-300 font-bold text-xl">Gợi ý tư duy để phân tích:</h5>
                                        </div>

                                        {/* 3 COLUMNS WITH FLEXBOX */}
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Hint 1 */}
                                            <div className="flex-1 group">
                                                <div className="relative h-full">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-800/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                                    <div className="relative bg-gradient-to-b from-red-50/10 to-red-900/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-red-400/30 group-hover:border-red-400/60 transition-all duration-300 group-hover:scale-[1.02] h-full">
                                                        <div className="flex flex-col items-center text-center h-full">
                                                            <div className="relative mb-4">
                                                                <div className="absolute inset-0 bg-red-400/20 rounded-full blur-md"></div>
                                                                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl">
                                                                    <span className="text-white text-xl">📜</span>
                                                                </div>
                                                            </div>

                                                            <h6 className="text-red-300 font-bold text-lg mb-3">1. Bối cảnh lịch sử</h6>

                                                            <div className="bg-red-900/40 rounded-xl p-3 w-full mb-4">
                                                                <span className="text-yellow-200/80 text-sm">Đặc điểm xã hội</span>
                                                                <p className="text-yellow-400 font-bold mt-1">Thuộc địa nửa phong kiến</p>
                                                            </div>

                                                            <p className="text-white/80 text-center leading-relaxed text-sm">
                                                                Xã hội Việt Nam đầu thế kỷ XX với những mâu thuẫn đặc thù
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hint 2 */}
                                            <div className="flex-1 group">
                                                <div className="relative h-full">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-800/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                                    <div className="relative bg-gradient-to-b from-orange-50/10 to-orange-900/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-orange-400/30 group-hover:border-orange-400/60 transition-all duration-300 group-hover:scale-[1.02] h-full">
                                                        <div className="flex flex-col items-center text-center h-full">
                                                            <div className="relative mb-4">
                                                                <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-md"></div>
                                                                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-2xl">
                                                                    <span className="text-white text-xl">⚖️</span>
                                                                </div>
                                                            </div>

                                                            <h6 className="text-orange-300 font-bold text-lg mb-3">2. Mục tiêu kép</h6>

                                                            <div className="bg-orange-900/40 rounded-xl p-3 w-full mb-4">
                                                                <span className="text-yellow-200/80 text-sm">Kết hợp hai nhiệm vụ</span>
                                                                <p className="text-yellow-400 font-bold mt-1">Dân tộc + Giai cấp</p>
                                                            </div>

                                                            <p className="text-white/80 text-center leading-relaxed text-sm">
                                                                Mối quan hệ giữa giải phóng dân tộc và giải phóng giai cấp
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hint 3 */}
                                            <div className="flex-1 group">
                                                <div className="relative h-full">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-yellow-800/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                                    <div className="relative bg-gradient-to-b from-yellow-50/10 to-yellow-900/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-400/30 group-hover:border-yellow-400/60 transition-all duration-300 group-hover:scale-[1.02] h-full">
                                                        <div className="flex flex-col items-center text-center h-full">
                                                            <div className="relative mb-4">
                                                                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md"></div>
                                                                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-2xl">
                                                                    <span className="text-white text-xl">🌟</span>
                                                                </div>
                                                            </div>

                                                            <h6 className="text-yellow-300 font-bold text-lg mb-3">3. Vận dụng sáng tạo</h6>

                                                            <div className="bg-yellow-900/40 rounded-xl p-3 w-full mb-4">
                                                                <span className="text-yellow-200/80 text-sm">Lý luận + Thực tiễn</span>
                                                                <p className="text-yellow-400 font-bold mt-1">Marx-Lenin + Việt Nam</p>
                                                            </div>

                                                            <p className="text-white/80 text-center leading-relaxed text-sm">
                                                                Sự vận dụng sáng tạo chủ nghĩa Marx-Lenin vào điều kiện Việt Nam
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Answer Button - UPGRADED */}
                                    <div className="text-center">
                                        <div className="mb-4">
                                            <p className="text-white/70 text-sm mb-2">Sẵn sàng khám phá câu trả lời chi tiết?</p>
                                        </div>

                                        <button
                                            onClick={() => setShowAnswerModal(true)}
                                            className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-500"></span>
                                            <span className="text-2xl">💡</span>
                                            <span className="relative">KHÁM PHÁ CÂU TRẢ LỜI PHÂN TÍCH</span>
                                            <span className="text-2xl">🔍</span>
                                        </button>

                                        <div className="mt-4 flex items-center justify-center gap-2">
                                            <span className="text-yellow-300/60 text-xs">•</span>
                                            <span className="text-white/60 text-xs">So sánh đối chiếu rõ ràng</span>
                                            <span className="text-yellow-300/60 text-xs">•</span>
                                            <span className="text-white/60 text-xs">Logic khoa học</span>
                                            <span className="text-yellow-300/60 text-xs">•</span>
                                            <span className="text-white/60 text-xs">Kết luận sâu sắc</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Modal câu trả lời - ĐÃ FIX FLEXBOX VÀ BỔ SUNG KẾT LUẬN */}
                        {showAnswerModal && (
                            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                <div className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-3xl border-4 border-yellow-400/50 shadow-2xl">
                                    {/* Modal background */}
                                    {/* Background Pattern ĐỘNG - ĐÃ THÊM LẠI */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute inset-0 bg-repeat opacity-30" style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd770' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                        }}></div>
                                    </div>

                                    <div className="relative z-10 p-2">
                                        {/* Modal header */}
                                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-500/20 to-red-600/20 backdrop-blur-sm border-b border-yellow-400/30">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                                                    <span className="text-2xl">💡</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-bold text-yellow-400">CÂU TRẢ LỜI PHÂN TÍCH</h3>
                                                    <p className="text-yellow-300/80 text-sm">So sánh đối chiếu rõ ràng, logic</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowAnswerModal(false)}
                                                className="text-white hover:text-yellow-400 text-3xl font-bold transition-colors duration-300 bg-red-900/50 hover:bg-red-800/50 w-10 h-10 rounded-full flex items-center justify-center"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* Modal content - ĐÃ FIX FLEXBOX */}
                                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                                            <div className="space-y-6">

                                                {/* PHẦN 1: So sánh 3 quan điểm - FIXED: DÙNG FLEXBOX */}
                                                <div className="bg-gradient-to-b from-black/50 to-red-900/30 rounded-2xl p-6 border border-yellow-400/20">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                                                        <h4 className="text-yellow-300 font-bold text-xl">SO SÁNH 3 QUAN ĐIỂM YÊU NƯỚC</h4>
                                                    </div>

                                                    {/* ==== FIX: CHUYỂN TỪ GRID SANG FLEXBOX ==== */}
                                                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                                                        {/* Phan Bội Châu */}
                                                        <div className="flex-1 bg-red-800/40 rounded-xl p-4 border border-red-400/30">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="text-red-300">🇯🇵</span>
                                                                <h5 className="text-red-300 font-bold">Phan Bội Châu</h5>
                                                            </div>
                                                            <p className="text-white/80 text-sm mb-2"><strong>Con đường:</strong> Dựa ngoại bang</p>
                                                            <p className="text-white/70 text-xs">"Đông Du", tìm Nhật Bản giúp đánh Pháp</p>
                                                            <div className="mt-3 pt-2 border-t border-red-400/20">
                                                                <span className="text-red-300/60 text-xs">• Độc lập hình thức</span>
                                                            </div>
                                                        </div>

                                                        {/* Phan Châu Trinh */}
                                                        <div className="flex-1 bg-orange-800/40 rounded-xl p-4 border border-yellow-400/30">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="text-yellow-300">📚</span>
                                                                <h5 className="text-yellow-300 font-bold">Phan Châu Trinh</h5>
                                                            </div>
                                                            <p className="text-white/80 text-sm mb-2"><strong>Con đường:</strong> Cải cách ôn hòa</p>
                                                            <p className="text-white/70 text-xs">"Khai dân trí", nâng cao dân trí trong khuôn khổ thuộc địa</p>
                                                            <div className="mt-3 pt-2 border-t border-yellow-400/20">
                                                                <span className="text-yellow-300/60 text-xs">• Cải cách từng bước</span>
                                                            </div>
                                                        </div>

                                                        {/* Hồ Chí Minh */}
                                                        <div className="flex-1 bg-gradient-to-b from-yellow-500/20 to-red-600/20 rounded-xl p-4 border-2 border-yellow-400">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="text-yellow-400">⭐</span>
                                                                <h5 className="text-yellow-400 font-bold">Hồ Chí Minh</h5>
                                                            </div>
                                                            <p className="text-white font-semibold text-sm mb-2"><strong>Con đường:</strong> Cách mạng triệt để</p>
                                                            <p className="text-yellow-100 text-xs font-medium">"Độc lập dân tộc + Chủ nghĩa xã hội"</p>
                                                            <div className="mt-3 pt-2 border-t border-yellow-400/30">
                                                                <span className="text-yellow-400 text-xs font-bold">• Độc lập thực chất</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* ========================================= */}

                                                    <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-lg p-4 border-l-4 border-yellow-400">
                                                        <p className="text-yellow-200 text-sm">
                                                            <strong>Điểm đột phá:</strong> Hồ Chí Minh không chỉ kế thừa tinh thần yêu nước của <strong>tiền nhân</strong>, mà còn <strong>nâng lên tầm cao mới</strong> bằng cách kết hợp với lý luận cách mạng khoa học.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* PHẦN 2: Sự khác biệt cốt lõi - ĐÃ FIX */}
                                                <div className="bg-gradient-to-b from-black/50 to-purple-900/30 rounded-2xl p-6 border border-purple-400/20">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="bg-purple-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                                                        <h4 className="text-purple-300 font-bold text-xl">SỰ KHÁC BIỆT CỐT LÕI</h4>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {/* Sử dụng FLEXBOX thay vì GRID */}
                                                        <div className="flex flex-col md:flex-row gap-4">
                                                            {/* Tiền nhân */}
                                                            <div className="flex-1 bg-red-900/30 rounded-lg p-4">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                                        <span className="text-red-400">👑</span>
                                                                    </div>
                                                                    <h5 className="text-red-300 font-bold">Tiền nhân:</h5>
                                                                </div>
                                                                <ul className="text-white/80 space-y-2">
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-red-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-red-200">Chỉ dừng ở độc lập lãnh thổ</strong>
                                                                            <p className="text-white/60 text-xs mt-1">Giành lại chủ quyền, nhưng không thay đổi cơ cấu xã hội</p>
                                                                        </div>
                                                                    </li>
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-red-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-red-200">Không thay đổi bản chất xã hội</strong>
                                                                            <p className="text-white/60 text-xs mt-1">Vẫn là chế độ phong kiến/quân chủ</p>
                                                                        </div>
                                                                    </li>
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-red-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-red-200">Vẫn duy trì áp bức, bóc lột</strong>
                                                                            <p className="text-white/60 text-xs mt-1">Nhân dân lao động vẫn bị bóc lột dưới hình thức mới</p>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            {/* Hồ Chí Minh */}
                                                            <div className="flex-1 bg-gradient-to-b from-yellow-500/20 to-orange-600/20 rounded-lg p-4 border border-yellow-400/30">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                                                        <span className="text-yellow-400">⭐</span>
                                                                    </div>
                                                                    <h5 className="text-yellow-300 font-bold">Hồ Chí Minh:</h5>
                                                                </div>
                                                                <ul className="text-yellow-100 space-y-2">
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-yellow-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-yellow-300">Độc lập dân tộc + CNXH</strong>
                                                                            <p className="text-yellow-100/60 text-xs mt-1">Kết hợp hai nhiệm vụ trong một</p>
                                                                        </div>
                                                                    </li>
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-yellow-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-yellow-300">Giải phóng toàn diện</strong>
                                                                            <p className="text-yellow-100/60 text-xs mt-1">Giải phóng dân tộc và giải phóng giai cấp</p>
                                                                        </div>
                                                                    </li>
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-yellow-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-yellow-300">Hướng tới hạnh phúc thực sự</strong>
                                                                            <p className="text-yellow-100/60 text-xs mt-1">Xóa bỏ mọi hình thức áp bức, bóc lột</p>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {/* Phần bước nhảy vọt */}
                                                        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                                                                    <span className="text-white text-xl">🚀</span>
                                                                </div>
                                                                <div>
                                                                    <h6 className="text-purple-300 font-bold mb-2">BƯỚC NHẢY VỌT LỊCH SỬ</h6>
                                                                    <p className="text-white text-sm leading-relaxed">
                                                                        Từ <strong className="text-red-300">"độc lập hình thức"</strong> (chỉ thay đổi chủ thể cai trị)
                                                                        → sang <strong className="text-yellow-300">"độc lập thực chất"</strong> (thay đổi toàn bộ cấu trúc xã hội).
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* PHẦN 3: Giá trị thời đại */}
                                                <div className="bg-gradient-to-b from-black/50 to-blue-900/30 rounded-2xl p-6 border border-blue-400/20">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="bg-blue-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                                                        <h4 className="text-blue-300 font-bold text-xl">GIÁ TRỊ THỜI ĐẠI</h4>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="bg-blue-900/20 rounded-lg p-4">
                                                            <h5 className="text-blue-300 font-bold mb-3 flex items-center gap-2">
                                                                <span>🎯</span>
                                                                Tại sao vẫn còn giá trị ngày nay?
                                                            </h5>
                                                            <ul className="text-white/80 space-y-2 text-sm">
                                                                <li className="flex items-start gap-2">
                                                                    <span className="text-blue-400 mt-1">•</span>
                                                                    <span><strong>Tính khoa học:</strong> Dựa trên phân tích thực tiễn Việt Nam, không giáo điều</span>
                                                                </li>
                                                                <li className="flex items-start gap-2">
                                                                    <span className="text-blue-400 mt-1">•</span>
                                                                    <span><strong>Tính nhân văn:</strong> Lấy hạnh phúc nhân dân làm mục tiêu cao nhất</span>
                                                                </li>
                                                                <li className="flex items-start gap-2">
                                                                    <span className="text-blue-400 mt-1">•</span>
                                                                    <span><strong>Tính sáng tạo:</strong> Vận dụng lý luận quốc tế vào điều kiện cụ thể trong nước</span>
                                                                </li>
                                                                <li className="flex items-start gap-2">
                                                                    <span className="text-blue-400 mt-1">•</span>
                                                                    <span><strong>Tính dự báo:</strong> Đặt nền móng cho phát triển bền vững</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* PHẦN KẾT LUẬN - ĐÃ FIX */}
                                                <div className="bg-gradient-to-b from-yellow-500/20 to-orange-600/30 rounded-2xl p-6 border-2 border-yellow-400/50">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                                                            ✓
                                                        </div>
                                                        <h4 className="text-yellow-300 font-bold text-xl">KẾT LUẬN TỔNG HỢP</h4>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {/* Tuyên bố chính */}
                                                        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-lg p-5 border-l-4 border-yellow-400">
                                                            <p className="text-yellow-200 text-lg leading-relaxed font-medium">
                                                                Tư tưởng <strong className="text-yellow-300">"Độc lập dân tộc gắn liền với Chủ nghĩa xã hội"</strong> của Hồ Chí Minh
                                                                không chỉ là một <strong className="text-yellow-300">sự đột phá lý luận</strong>, mà còn là
                                                                <strong className="text-yellow-300"> giải pháp thực tiễn hoàn chỉnh</strong> cho vấn đề dân tộc và giai cấp trong điều kiện Việt Nam.
                                                            </p>
                                                        </div>

                                                        {/* Bài học & Giá trị - FLEXBOX */}
                                                        <div className="flex flex-col md:flex-row gap-4">
                                                            {/* Bài học lịch sử */}
                                                            <div className="flex-1 bg-black/40 rounded-lg p-4">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                                                        <span className="text-yellow-400">📜</span>
                                                                    </div>
                                                                    <h5 className="text-yellow-300 font-bold">Bài học lịch sử:</h5>
                                                                </div>
                                                                <ul className="text-white/80 space-y-3">
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-yellow-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-yellow-200">Kế thừa có chọn lọc tinh hoa truyền thống</strong>
                                                                            <p className="text-white/60 text-xs mt-1">Giữ lại tinh thần yêu nước, loại bỏ hạn chế lịch sử</p>
                                                                        </div>
                                                                    </li>
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-yellow-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-yellow-200">Vận dụng sáng tạo lý luận vào thực tiễn</strong>
                                                                            <p className="text-white/60 text-xs mt-1">Không rập khuôn, máy móc chủ nghĩa Marx-Lenin</p>
                                                                        </div>
                                                                    </li>
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-yellow-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-yellow-200">Luôn đặt lợi ích nhân dân lên hàng đầu</strong>
                                                                            <p className="text-white/60 text-xs mt-1">Mục tiêu cao nhất là hạnh phúc của nhân dân lao động</p>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            {/* Giá trị hiện tại */}
                                                            <div className="flex-1 bg-red-900/40 rounded-lg p-4">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                                        <span className="text-red-400">🎯</span>
                                                                    </div>
                                                                    <h5 className="text-red-300 font-bold">Giá trị hiện tại:</h5>
                                                                </div>
                                                                <ul className="text-white/80 space-y-3">
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-red-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-red-200">Vẫn là kim chỉ nam cho phát triển đất nước</strong>
                                                                            <p className="text-white/60 text-xs mt-1">Định hướng cho công cuộc đổi mới và hội nhập</p>
                                                                        </div>
                                                                    </li>
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-red-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-red-200">Giúp giữ vững độc lập trong hội nhập quốc tế</strong>
                                                                            <p className="text-white/60 text-xs mt-1">Cân bằng giữa mở cửa và bảo vệ chủ quyền</p>
                                                                        </div>
                                                                    </li>
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="text-red-400 mt-1">•</span>
                                                                        <div>
                                                                            <strong className="text-red-200">Đảm bảo phát triển bền vững, công bằng</strong>
                                                                            <p className="text-white/60 text-xs mt-1">Phát triển kinh tế đi đôi với công bằng xã hội</p>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {/* Câu trích dẫn cuối */}
                                                        <div className="bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-lg p-4 border-l-4 border-yellow-400">
                                                            <div className="flex items-start gap-3">
                                                                <div className="text-2xl">💎</div>
                                                                <div>
                                                                    <p className="text-white text-sm italic leading-relaxed">
                                                                        "Sự khác biệt của Hồ Chí Minh so với tiền nhân không phải ở mục tiêu yêu nước,
                                                                        mà ở <strong className="text-yellow-300">tầm nhìn chiến lược</strong> và
                                                                        <strong className="text-yellow-300"> phương pháp khoa học</strong> để đạt được mục tiêu đó."
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Scroll Indicator */}
                        <div className="text-center mt-16">
                            <div className="inline-flex flex-col items-center gap-2">
                                <span className="text-yellow-300/60 text-sm">Cuộn xuống để tiếp tục</span>
                                <button
                                    onClick={() => scrollToNextSection('cau-hoi-suy-ngam')}
                                    className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform animate-bounce"
                                    aria-label="Chuyển đến phần tiếp theo"
                                >
                                    <ChevronDown className="w-8 h-8" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                                                                                                   

                


                {/* Quiz */}
                <section id="quiz" className="py-16 bg-gradient-to-r from-red-900 to-red-800 relative overflow-hidden min-h-screen flex items-center" data-reveal>
                    {/* Video nền */}
                    <video
                        className="absolute inset-0 w-full h-full object-cover opacity-25"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                    >
                        <source src="/quiz.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Overlay để làm sẫm video */}
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        {/* Title gọn hơn */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-4 tracking-wider relative">
                                <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                    KIỂM TRA KIẾN THỨC
                                </span>
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full"></div>
                            </h2>
                            <p className="text-lg text-white opacity-90 font-medium">
                                TƯ TƯỞNG HỒ CHÍ MINH VỀ ĐỘC LẬP DÂN TỘC VÀ CHỦ NGHĨA XÃ HỘI
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <Card className="bg-yellow-50 border-yellow-400 shadow-2xl backdrop-blur-sm bg-opacity-95">
                                <CardHeader className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-yellow-300 py-4">
                                    <CardTitle className="text-xl font-bold text-center">
                                        Câu {currentQuiz + 1} / {quizQuestions.length}
                                        <div className="w-full bg-red-900 rounded-full h-1.5 mt-2">
                                            <div
                                                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${((currentQuiz + 1) / quizQuestions.length) * 100}%` }}
                                            ></div>
                                        </div>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">{quizQuestions[currentQuiz].question}</h3>
                                    <div className="space-y-3 mb-6">
                                        {quizQuestions[currentQuiz].options.map((option, index) => (
                                            <Button
                                                key={index}
                                                variant={selectedAnswer === index ? (index === quizQuestions[currentQuiz].correct ? 'default' : 'destructive') : 'outline'}
                                                className={`w-full text-left justify-start p-4 h-auto text-sm transition-all duration-300 ${selectedAnswer === index
                                                    ? index === quizQuestions[currentQuiz].correct
                                                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                                                        : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                                                    : 'border-gray-400 text-black hover:bg-gray-100 hover:border-gray-500 bg-white'
                                                    } ${showAnswer && index === quizQuestions[currentQuiz].correct ? 'bg-green-600 text-white shadow-lg' : ''}`}
                                                onClick={() => handleQuizAnswer(index)}
                                                disabled={showAnswer}
                                            >
                                                <span className="mr-3 font-bold bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                <span className="flex-1 text-black">{option}</span>
                                            </Button>
                                        ))}
                                    </div>

                                    {showAnswer && (
                                        <div className="mb-6">
                                            {selectedAnswer === quizQuestions[currentQuiz].correct ? (
                                                // Đúng - Hiển thị giải thích
                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-600 shadow-lg">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">✓</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-green-800 font-semibold mb-1">Chính xác!</p>
                                                            <p className="text-green-700 text-sm leading-relaxed">{quizQuestions[currentQuiz].explanation}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Sai - Hiển thị thông báo sai và đáp án đúng
                                                <div className="space-y-3">
                                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-l-4 border-red-600 shadow-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                                                <span className="text-white text-sm font-bold">✗</span>
                                                            </div>
                                                            <p className="text-red-800 font-semibold">Chưa chính xác. Đáp án đúng là: {String.fromCharCode(65 + quizQuestions[currentQuiz].correct)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-600 shadow-lg">
                                                        <div className="flex items-start space-x-3">
                                                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                                <span className="text-white text-sm font-bold">i</span>
                                                            </div>
                                                            <p className="text-blue-800 text-sm leading-relaxed">{quizQuestions[currentQuiz].explanation}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {showAnswer && currentQuiz < quizQuestions.length - 1 && (
                                        <div className="text-center">
                                            <Button onClick={nextQuestion} className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-yellow-300 px-6 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                                Câu tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}

                                    {showAnswer && currentQuiz === quizQuestions.length - 1 && (
                                        <div className="text-center">
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 shadow-lg">
                                                <h4 className="text-xl font-bold text-green-800 mb-1">🎉 Hoàn thành!</h4>
                                                <p className="text-green-700">Bạn đã hoàn thành bộ câu hỏi về tư tưởng Hồ Chí Minh</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Nút mũi tên xuống */}
                        <div className="text-center mt-8">
                            <button
                                onClick={() => scrollToNextSection('quiz')}
                                className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform bg-black bg-opacity-30 rounded-full p-3"
                                aria-label="Chuyển đến section tiếp theo"
                            >
                                <ChevronDown className="w-6 h-6" />
                            </button>
                        </div>

                    </div>
                </section>

                {/* AI Transparency Section - Traditional Vietnamese Style */}
                <section id="tinh-minh-bach-ai" className="relative bg-gradient-to-br from-red-800 via-red-900 to-black py-20" data-reveal>
                    {/* Video nền động */}
                    <video
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="/5.2.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Overlay để làm sẫm video */}
                    <div className="absolute inset-0 bg-black bg-opacity-60 z-5"></div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 z-10">
                        <div className="absolute inset-0 bg-repeat opacity-30" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd770' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>
                    </div>

                    <div className="relative z-20 max-w-7xl mx-auto px-6">
                        {/* Header section */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-4 mb-6 px-8 py-3 bg-yellow-400/20 backdrop-blur-sm rounded-full border-2 border-yellow-400/50">
                                <span className="text-3xl">🤖</span>
                                <span className="text-yellow-300 text-lg font-bold tracking-wide font-mono">
                                    TÍNH MINH BẠCH KHI SỬ DỤNG AI
                                </span>
                                <span className="text-3xl">📋</span>
                            </div>

                            <h2 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-4 tracking-wide">
                                Công cụ AI trong Học thuật
                            </h2>
                            <p className="text-xl text-white/90 max-w-3xl mx-auto">
                                Cam kết minh bạch về việc sử dụng AI trong tạo hình ảnh minh họa cho bài thuyết trình
                            </p>
                            <div className="w-32 h-1 bg-yellow-400 mx-auto mt-6"></div>
                        </div>

                        {/* 8 ô nội dung - phong cách truyền thống */}
                        <div className="max-w-6xl mx-auto space-y-8">
                            {/* Ô 1 - Công cụ AI đã sử dụng */}
                            <div className="w-full mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-yellow-400 p-8 rounded-3xl shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300">
                                <h3 className="text-3xl font-bold text-red-800 mb-6 flex items-center">
                                    <span className="bg-red-800 text-yellow-400 rounded-full w-12 h-12 flex items-center justify-center text-xl font-black mr-6">1</span>
                                    Công cụ AI đã sử dụng
                                </h3>
                                <div className="space-y-6">
                                    <div className="bg-white/80 rounded-2xl p-6 border-2 border-red-200">
                                        <h4 className="text-red-700 font-bold text-xl mb-3 flex items-center gap-3">
                                            <span className="text-2xl">🎥</span>
                                            Runway Gen-2
                                        </h4>
                                        <p className="text-red-600 text-lg leading-relaxed">Tạo video minh họa chính từ prompt mô tả chi tiết, chuyển cảnh mượt mà.</p>
                                    </div>
                                    <div className="bg-white/80 rounded-2xl p-6 border-2 border-red-200">
                                        <h4 className="text-red-700 font-bold text-xl mb-3 flex items-center gap-3">
                                            <span className="text-2xl">🎨</span>
                                            GPT (OpenAI)
                                        </h4>
                                        <p className="text-red-600 text-lg leading-relaxed">Tạo minh họa, biểu tượng, texture và background theo prompt chi tiết.</p>
                                    </div>
                                    <div className="bg-white/80 rounded-2xl p-6 border-2 border-red-200">
                                        <h4 className="text-red-700 font-bold text-xl mb-3 flex items-center gap-3">
                                            <span className="text-2xl">🌟</span>
                                            Gemini (Google)
                                        </h4>
                                        <p className="text-red-600 text-lg leading-relaxed">Tạo ảnh/đồ họa bổ sung và biến thể để đa dạng hóa trải nghiệm.</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-6 border-l-4 border-yellow-400">
                                        <p className="text-red-700 font-semibold text-lg">
                                            → Nội dung video được tạo bằng AI để minh họa khái niệm, timeline, poster mô phỏng phong cách cổ động.
                                        </p>
                                        <p className="text-red-700 font-semibold text-lg mt-3">
                                            → Các hình ảnh AI được sử dụng để làm cho bài giảng về tư tưởng Hồ Chí Minh trở nên hấp dẫn và trực quan hơn.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Ô 2 - Mục đích sử dụng AI */}
                            <div className="w-full mx-auto bg-gradient-to-r from-red-50 to-pink-50 border-4 border-red-400 p-10 rounded-3xl shadow-2xl hover:shadow-red-400/20 transition-all duration-300">
                                <h3 className="text-4xl font-bold text-red-800 mb-8 flex items-center">
                                    <span className="bg-red-800 text-yellow-400 rounded-full w-14 h-14 flex items-center justify-center text-2xl font-black mr-8">2</span>
                                    Mục đích sử dụng AI trong Học thuật
                                </h3>
                                <div className="space-y-6">
                                    <div className="bg-white/95 rounded-2xl p-8 border-3 border-red-200 shadow-lg">
                                        <div className="flex items-start gap-6">
                                            <div className="text-6xl flex-shrink-0">📈</div>
                                            <div className="flex-1">
                                                <h4 className="text-red-700 font-bold text-2xl mb-4">Nâng cao trải nghiệm người dùng (UX)</h4>
                                                <ul className="text-red-600 text-lg space-y-2">
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-red-500 text-xl mt-1">•</span>
                                                        <span>Tạo hình ảnh trực quan cho các mốc lịch sử quan trọng</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-red-500 text-xl mt-1">•</span>
                                                        <span>Sơ đồ hóa các khái niệm phức tạp thành hình ảnh dễ hiểu</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-red-500 text-xl mt-1">•</span>
                                                        <span>Thiết kế layout và background phù hợp với chủ đề</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/95 rounded-2xl p-8 border-3 border-red-200 shadow-lg">
                                        <div className="flex items-start gap-6">
                                            <div className="text-6xl flex-shrink-0">🎨</div>
                                            <div className="flex-1">
                                                <h4 className="text-red-700 font-bold text-2xl mb-4">Tạo minh họa chuyên biệt</h4>
                                                <ul className="text-red-600 text-lg space-y-2">
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-red-500 text-xl mt-1">•</span>
                                                        <span>Tạo biểu tượng và icon phù hợp với nội dung học thuật</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-red-500 text-xl mt-1">•</span>
                                                        <span>Thiết kế poster và banner theo phong cách cổ động</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-red-500 text-xl mt-1">•</span>
                                                        <span>Tạo texture và pattern nền phù hợp với theme Việt Nam</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/95 rounded-2xl p-8 border-3 border-red-200 shadow-lg">
                                        <div className="flex items-start gap-6">
                                            <div className="text-6xl flex-shrink-0">⚖️</div>
                                            <div className="flex-1">
                                                <h4 className="text-red-700 font-bold text-2xl mb-4">Đảm bảo tính chính xác và đạo đức</h4>
                                                <ul className="text-red-600 text-lg space-y-2">
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-red-500 text-xl mt-1">•</span>
                                                        <span>Chỉ mang tính minh họa, không thay thế tài liệu gốc</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-red-500 text-xl mt-1">•</span>
                                                        <span>Không tạo giả mạo tư liệu lịch sử hay chứng cứ</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-red-500 text-xl mt-1">•</span>
                                                        <span>Tuân thủ nguyên tắc học thuật và bản quyền</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ô 3 - Vai trò hỗ trợ */}
                            <div className="w-full mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-500 p-8 rounded-3xl shadow-2xl hover:shadow-green-400/20 transition-all duration-300">
                                <h3 className="text-3xl font-bold text-red-800 mb-6 flex items-center">
                                    <span className="bg-red-800 text-yellow-400 rounded-full w-12 h-12 flex items-center justify-center text-xl font-black mr-6">3</span>
                                    Vai trò hỗ trợ – không thay thế
                                </h3>
                                <ul className="space-y-4 text-lg">
                                    <li className="flex items-start bg-white/80 rounded-xl p-4 border-2 border-green-200">
                                        <span className="text-green-500 mr-4 mt-1 text-2xl">✓</span>
                                        <span className="text-red-700">AI chỉ hỗ trợ tạo minh họa/đồ họa; nội dung học thuật do sinh viên biên soạn.</span>
                                    </li>
                                    <li className="flex items-start bg-white/80 rounded-xl p-4 border-2 border-green-200">
                                        <span className="text-green-500 mr-4 mt-1 text-2xl">✓</span>
                                        <span className="text-red-700">Text, trích dẫn, lập luận đều trải qua biên tập thủ công và đối chiếu nguồn.</span>
                                    </li>
                                    <li className="flex items-start bg-white/80 rounded-xl p-4 border-2 border-green-200">
                                        <span className="text-green-500 mr-4 mt-1 text-2xl">✓</span>
                                        <span className="text-red-700">Không dùng AI để tạo giả mạo tư liệu lịch sử hay thay đổi ngữ cảnh tài liệu.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Ô 4 - Quy trình kiểm tra */}
                            <div className="w-full mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-500 p-10 rounded-3xl shadow-2xl hover:shadow-blue-400/20 transition-all duration-300">
                                <h3 className="text-4xl font-bold text-red-800 mb-8 flex items-center">
                                    <span className="bg-red-800 text-yellow-400 rounded-full w-14 h-14 flex items-center justify-center text-2xl font-black mr-8">4</span>
                                    Quy trình kiểm tra và đảm bảo chất lượng
                                </h3>
                                <div className="space-y-6">
                                    <div className="bg-white/95 rounded-2xl p-8 border-3 border-blue-200 shadow-lg">
                                        <div className="flex items-start gap-6">
                                            <div className="text-6xl flex-shrink-0">🏷️</div>
                                            <div className="flex-1">
                                                <h4 className="text-blue-700 font-bold text-2xl mb-4">Ghi nhãn và đánh dấu nguồn gốc</h4>
                                                <ul className="text-blue-600 text-lg space-y-2">
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-blue-500 text-xl mt-1">•</span>
                                                        <span>Gắn tag "AI-generated" trong metadata của tệp hình ảnh</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-blue-500 text-xl mt-1">•</span>
                                                        <span>Thêm watermark hoặc chú thích góc ảnh khi cần thiết</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-blue-500 text-xl mt-1">•</span>
                                                        <span>Ghi rõ alt text để phân biệt với hình ảnh thật</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/95 rounded-2xl p-8 border-3 border-blue-200 shadow-lg">
                                        <div className="flex items-start gap-6">
                                            <div className="text-6xl flex-shrink-0">🔍</div>
                                            <div className="flex-1">
                                                <h4 className="text-blue-700 font-bold text-2xl mb-4">Kiểm duyệt nội dung và chất lượng</h4>
                                                <ul className="text-blue-600 text-lg space-y-2">
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-blue-500 text-xl mt-1">•</span>
                                                        <span>Lọc và loại bỏ nội dung có thể gây hiểu lầm hoặc nhạy cảm</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-blue-500 text-xl mt-1">•</span>
                                                        <span>Đảm bảo prompt phù hợp với ngữ cảnh học thuật</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-blue-500 text-xl mt-1">•</span>
                                                        <span>Kiểm tra tính chính xác của hình ảnh so với mô tả</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/95 rounded-2xl p-8 border-3 border-blue-200 shadow-lg">
                                        <div className="flex items-start gap-6">
                                            <div className="text-6xl flex-shrink-0">📝</div>
                                            <div className="flex-1">
                                                <h4 className="text-blue-700 font-bold text-2xl mb-4">Lưu trữ và theo dõi</h4>
                                                <ul className="text-blue-600 text-lg space-y-2">
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-blue-500 text-xl mt-1">•</span>
                                                        <span>Ghi nhật ký prompt và thông số tạo để truy vết</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-blue-500 text-xl mt-1">•</span>
                                                        <span>Lưu phiên bản gốc và các chỉnh sửa sau đó</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="text-blue-500 text-xl mt-1">•</span>
                                                        <span>Tạo báo cáo tổng hợp việc sử dụng AI cho từng project</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-red-900 border-t border-yellow-400/20 py-8">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-yellow-100 mb-4">© 2026 - Tư tưởng Hồ Chí Minh về Độc lập dân tộc và Chủ nghĩa xã hội - Nhóm SPST2 - AI1807</p>
                        <p className="text-yellow-300 text-sm">"Không có gì quý hơn độc lập, tự do" - Chủ tịch Hồ Chí Minh</p>
                    </div>
                </footer>

                {/* Nút lên đầu trang - Fixed position */}
                {showBackTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-500 text-red-900 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
                        aria-label="Lên đầu trang"
                    >
                        <ArrowRight className="w-6 h-6 transform -rotate-90" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default App