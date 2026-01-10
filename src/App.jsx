import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
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

  // Navigation items (label -> target id)
  const navItems = [
    { id: 'hero', label: 'Trang chủ' },
    { id: 'timeline', label: 'Hành trình' },
    { id: 'dai-doan-ket', label: 'Đại đoàn kết dân tộc' },
    { id: 'doan-ket-quoc-te', label: 'Đoàn kết quốc tế' },
    { id: 'cau-hoi-suy-ngam', label: 'Câu hỏi suy ngẫm' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'prove', label: 'Tính minh bạch AI' }
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
      question: 'Theo Hồ Chí Minh, đại đoàn kết toàn dân tộc có vai trò như thế nào đối với cách mạng Việt Nam?',
      options: [
        'Là một thủ đoạn chính trị nhất thời.',
        'Là vấn đề có ý nghĩa chiến lược, quyết định thành công của cách mạng.',
        'Chỉ cần thiết trong giai đoạn cách mạng dân tộc dân chủ nhân dân.',
        'Không cần thiết khi có sự lãnh đạo của Đảng.'
      ],
      correct: 1,
      explanation: 'Theo Hồ Chí Minh, đại đoàn kết toàn dân tộc là một vấn đề có ý nghĩa chiến lược, quyết định sự thành công của cách mạng Việt Nam. Người coi đó là chiến lược lâu dài, nhất quán và là nhân tố sống còn của dân tộc.'
    },
    {
      question: 'Lực lượng của khối đại đoàn kết toàn dân tộc theo tư tưởng Hồ Chí Minh bao gồm những ai?',
      options: [
        'Chỉ công nhân và nông dân.',
        'Chỉ những người theo Đảng Cộng sản.',
        'Toàn thể nhân dân, tất cả những người Việt Nam yêu nước ở các giai cấp, tầng lớp, tôn giáo, lứa tuổi.',
        'Chỉ những người có trình độ tri thức cao.'
      ],
      correct: 2,
      explanation: 'Hồ Chí Minh khẳng định chủ thể của khối đại đoàn kết toàn dân tộc là "toàn thể nhân dân, tất cả những người Việt Nam yêu nước ở các giai cấp, các tầng lớp trong xã hội, các ngành, các giới, các lứa tuổi, các dân tộc, đồng bào các tôn giáo, các đảng phái, v.v."'
    },
    {
      question: 'Hồ Chí Minh đã đúc kết về sức mạnh của đại đoàn kết toàn dân tộc qua câu nói nổi tiếng nào?',
      options: [
        '"Không có gì quý hơn độc lập, tự do."',
        '"Đoàn kết, đoàn kết, đại đoàn kết; Thành công, thành công, đại thành công."',
        '"Vì lợi ích mười năm trồng cây, vì lợi ích trăm năm trồng người."',
        '"Nước Việt Nam là một, dân tộc Việt Nam là một."'
      ],
      correct: 1,
      explanation: 'Câu nói nổi tiếng của Hồ Chí Minh về sức mạnh của đại đoàn kết là: "Đoàn kết, đoàn kết, đại đoàn kết; Thành công, thành công, đại thành công."'
    },
    {
      question: 'Một trong những nguyên tắc cơ bản của đại đoàn kết dân tộc theo Hồ Chí Minh là gì?',
      options: [
        'Chỉ đoàn kết những người có cùng quan điểm chính trị.',
        'Đại đoàn kết phải được xây dựng trên cơ sở bảo đảm những lợi ích tối cao của dân tộc, lợi ích của nhân dân lao động.',
        'Đoàn kết mà không cần đấu tranh, phê bình.',
        'Coi trọng cái riêng, cái khác biệt hơn cái chung.'
      ],
      correct: 1,
      explanation: 'Một trong những nguyên tắc quan trọng là "Đại đoàn kết phải được xây dựng trên cơ sở bảo đảm những lợi ích tối cao của dân tộc, lợi ích của nhân dân lao động và quyền thiêng liêng của con người". Người luôn tìm kiếm và phát huy những yếu tố tương đồng, thu hẹp những khác biệt.'
    },
    {
      question: 'Tư tưởng Hồ Chí Minh về đoàn kết quốc tế được hình thành trên cơ sở nào?',
      options: [
        'Chỉ dựa trên truyền thống yêu nước của dân tộc.',
        'Chỉ dựa trên việc tiếp thu chủ nghĩa Marx-Lenin.',
        'Trên nền tảng truyền thống yêu nước, tinh thần đoàn kết của dân tộc; trên cơ sở thấm nhuần chủ nghĩa Marx-Lenin; từ thực tiễn hoạt động cách mạng của Người.',
        'Chỉ dựa vào việc đoàn kết với các nước xã hội chủ nghĩa.'
      ],
      correct: 2,
      explanation: 'Tư tưởng Hồ Chí Minh về đoàn kết quốc tế được hình thành và phát triển trên nền tảng truyền thống yêu nước, tinh thần đoàn kết của dân tộc; trên cơ sở thấm nhuần chủ nghĩa Marx-Lenin và đường lối của Quốc tế Cộng sản; từ thực tiễn hoạt động cách mạng sôi nổi của Người.'
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
    const targets = document.querySelectorAll('#doan-ket-quoc-te [data-intl-topic]')
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
        e.preventDefault(); closeIntro(false)
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
        <nav className={`site-nav fixed top-0 w-full z-50 ${darkMode ? 'nav-dark' : ''}`}>
          <div className="nav-inner container mx-auto px-4">
            <button onClick={() => window.location.reload()} className="nav-left font-extrabold tracking-wide text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 rounded-sm" aria-label="Tải lại trang">HCM202_AI1807</button>
            <ul className="nav-menu hidden md:flex">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => scrollToSection(item.id)}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="nav-right flex items-center gap-3">
              <button aria-label="Chuyển chế độ sáng/tối" className="mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="group-badge">NHÓM SPST2</div>
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
                <h1 className="hero-heading-compact" aria-label="Tư tưởng Hồ Chí Minh về đại đoàn kết toàn dân tộc và đoàn kết quốc tế">
                  TƯ TƯỞNG HỒ CHÍ MINH VỀ ĐẠI ĐOÀN KẾT TOÀN DÂN TỘC VÀ ĐOÀN KẾT QUỐC TẾ
                </h1>
                <p className="hero-desc-compact" data-reveal>
                  Khám phá tư tưởng sâu sắc của Chủ tịch Hồ Chí Minh về đại đoàn kết toàn dân tộc và đoàn kết quốc tế – nền tảng vững chắc cho sự nghiệp cách mạng Việt Nam.
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
                <div className="chapter5-single-frame" aria-label="Chương 5: Tư tưởng Hồ Chí Minh về đại đoàn kết toàn dân tộc và đoàn kết quốc tế">
                  <img
                    src="/1.png"
                    alt="Chương 5: Tư tưởng Hồ Chí Minh về đại đoàn kết toàn dân tộc và đoàn kết quốc tế"
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
                <p>Tư tưởng Hồ Chí Minh về đại đoàn kết dân tộc và đoàn kết quốc tế là kim chỉ nam cho sự nghiệp cách mạng Việt Nam. Từ truyền thống nhân ái, gắn kết cộng đồng của dân tộc, Người phát triển thành quan điểm chiến lược: lấy nhân dân làm gốc, mở rộng mặt trận đoàn kết, kết hợp sức mạnh dân tộc với sức mạnh thời đại. Chuyên trang giúp người học tiếp cận hệ thống, có chứng cứ lịch sử - từ Cách mạng Tháng Tám, kháng chiến chống xâm lược đến công cuộc đổi mới - qua đó hiểu vì sao đoàn kết là nguồn sức mạnh quyết định thắng lợi của cách mạng Việt Nam và là cầu nối Việt Nam với bạn bè năm châu.</p>
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
            <h2 className="text-4xl font-bold text-center text-yellow-300 mb-16">HÀNH TRÌNH TƯ TƯỞNG ĐẠI ĐOÀN KẾT</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-yellow-400" />
              <div className="space-y-6 md:space-y-10">
                {[
                  { year: '1920', event: 'Tham gia Đại hội Đảng Xã hội Pháp tại Tours', description: 'Nguyễn Ái Quốc bỏ phiếu tán thành gia nhập Quốc tế Cộng sản' },
                  { year: '1930', event: 'Thành lập Đảng Cộng sản Việt Nam', description: 'Đặt nền móng cho sự lãnh đạo của Đảng trong đại đoàn kết dân tộc' },
                  { year: '1941', event: 'Thành lập Mặt trận Việt Minh', description: 'Hình thức tổ chức cụ thể của khối đại đoàn kết toàn dân tộc' },
                  { year: '1945', event: 'Cách mạng Tháng Tám thành công', description: 'Thắng lợi của tư tưởng đại đoàn kết toàn dân tộc' },
                  { year: '1969', event: 'Di chúc Hồ Chí Minh', description: 'Khẳng định tầm quan trọng của đoàn kết trong Đảng và đoàn kết quốc tế' }
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

        {/* 5.1 Section: Đại đoàn kết dân tộc ở Việt Nam */}
        <section id="dai-doan-ket" className="min-h-screen bg-gradient-to-br from-red-700 via-red-800 to-red-900 relative overflow-hidden">
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
                ĐẠI ĐOÀN KẾT DÂN TỘC Ở VIỆT NAM
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
                      Đại đoàn kết toàn dân tộc là vấn đề có ý nghĩa chiến lược, là nhân tố cơ bản quyết định thắng lợi của cách mạng Việt Nam.
                    </p>
                  </div>
                  <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-yellow-400 hover:scale-105 transition-all duration-300 flex-shrink-0 animate-float">
                    <img src="/5.1.1.png" alt="Vai trò" className="w-full h-full object-cover scale-125" />
                  </div>
                </div>
              </div>

              {/* HÌNH THỨC TỔ CHỨC - Middle right, chữ bên phải */}
              <div className="absolute top-[138px] right-[-30px]">
                <div className="flex items-center gap-10 flex-row-reverse">
                  <div className="w-[320px]">
                    <h3 className="text-4xl font-bold text-yellow-400 mb-4" style={{ textAlign: 'left' }}>HÌNH THỨC TỔ CHỨC</h3>
                    <p className="text-white text-base leading-7" style={{ textAlign: 'left', lineHeight: '1.5' }}>
                      <span className="text-yellow-300 font-semibold">Mặt trận dân tộc thống nhất</span> là hình thức tổ chức cụ thể của khối đại đoàn kết toàn dân tộc.
                    </p>
                  </div>
                  <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl border-3 border-yellow-400 hover:scale-105 transition-all duration-300 flex-shrink-0 animate-float-delay">
                    <img src="/5.1.2.png" alt="Hình thức" className="w-full h-full object-cover scale-125" />
                  </div>
                </div>
              </div>

              {/* LỰC LƯỢNG - Middle left, chữ bên trái */}
              <div className="absolute top-[280px] left-[-150px]">
                <div className="flex items-center gap-14">
                  <div className="w-[420px]">
                    <h3 className="text-3xl font-bold text-yellow-400 mb-4" style={{ textAlign: 'right' }}>LỰC LƯỢNG CỦA KHỐI ĐẠI ĐOÀN KẾT</h3>
                    <div className="text-white text-base leading-7 space-y-2" style={{ textAlign: 'right', lineHeight: '1.5' }}>
                      <p><span className="text-yellow-300 font-semibold">Chủ thể:</span> Toàn thể nhân dân Việt Nam</p>
                      <p><span className="text-yellow-300 font-semibold">Lực lượng nòng cốt:</span> Giai cấp công nhân, nông dân và trí thức là những lực lượng chủ yếu.</p>
                    </div>
                  </div>
                  <div className="w-56 h-56 rounded-full overflow-hidden shadow-xl border-4 border-yellow-400 hover:scale-105 transition-all duration-300 flex-shrink-0 animate-float-slow">
                    <img src="/5.1.3.png" alt="Lực lượng" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* 4 ĐIỀU KIỆN - Bottom right, chữ bên phải */}
              <div className="absolute bottom-0 right-[-205px]">
                <div className="flex items-center gap-9 flex-row-reverse">
                  <div className="w-[480px]">
                    <h3 className="text-4xl font-bold text-yellow-400 mb-6" style={{ textAlign: 'left' }}>4 ĐIỀU KIỆN XÂY DỰNG</h3>
                    <div className="text-white text-base leading-7 space-y-3" style={{ textAlign: 'left', lineHeight: '1.6' }}>
                      <p><span className="text-yellow-300 font-semibold">1.</span> Lấy lợi ích chung của dân tộc làm điểm quy tụ</p>
                      <p><span className="text-yellow-300 font-semibold">2.</span> Kế thừa và phát huy truyền thống yêu nước</p>
                      <p><span className="text-yellow-300 font-semibold">3.</span> Có niềm tin sâu sắc vào nhân dân</p>
                      <p><span className="text-yellow-300 font-semibold">4.</span> Có sự lãnh đạo của Đảng Cộng sản Việt Nam</p>
                    </div>
                  </div>
                  <div className="w-64 h-64 rounded-full overflow-hidden shadow-xl border-4 border-yellow-400 hover:scale-105 transition-all duration-300 flex-shrink-0 animate-float-gentle">
                    <img src="/5.1.4.png" alt="Điều kiện" className="w-full h-full object-cover scale-125" />
                  </div>
                </div>
              </div>

            </div>

            {/* Nút mũi tên xuống để chuyển section */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
              <button
                onClick={() => scrollToNextSection('dai-doan-ket')}
                className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform"
                aria-label="Chuyển đến section tiếp theo"
              >
                <ChevronDown className="w-8 h-8" />
              </button>
            </div>
          </div>
        </section>

        {/* 5.2 Section: Đoàn kết quốc tế (kiểu lồng đèn) */}
        <section id="doan-ket-quoc-te" className="relative overflow-hidden bg-red-900 py-20 min-h-[1400px]">
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
              ĐOÀN KẾT QUỐC TẾ
            </h2>
            <p className="text-white text-lg opacity-90">
              Vị trí – Ý nghĩa • Cơ sở hình thành • Nội dung • Nguyên tắc • Phương thức
            </p>
            <div className="w-32 h-1 bg-yellow-400 mx-auto mt-6"></div>
          </div>

          {/* Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-8 min-h-[1000px]">

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
                  Đoàn kết quốc tế là bộ phận hữu cơ của cách mạng Việt Nam; là nhân tố chiến lược bảo đảm thắng lợi bền vững.
                </p>
                <p className="text-white leading-9 text-xl">
                  Giúp kết hợp sức mạnh dân tộc với sức mạnh thời đại, tạo thế, lực và uy tín quốc tế.
                </p>
              </div>
            </div>

            {/* 2. Cơ sở hình thành */}
            <div className="absolute top-[580px] left-[30px] flex items-center gap-8">
              <div className="w-44 h-44 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 flex-shrink-0 hover:scale-105 transition-all duration-500 animate-float-delay">
                <img 
                  src="/5.2.2.png" 
                  alt="Cơ sở hình thành" 
                  className="w-full h-full object-cover scale-110 transform hover:scale-125 transition-transform duration-300"
                />
              </div>
              <div className="w-[480px] text-left">
                <h3 className="text-3xl font-bold text-yellow-300 mb-4">Cơ sở hình thành</h3>
                <ul className="list-none text-white space-y-3 text-lg">
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-xl">•</span>
                    <span>Truyền thống nhân ái, yêu chuộng hòa bình</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-xl">•</span>
                    <span>Tư tưởng độc lập dân tộc gắn CNXH</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-xl">•</span>
                    <span>Xu thế tiến bộ của thời đại</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-xl">•</span>
                    <span>Phong trào giải phóng dân tộc dâng cao</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-xl">•</span>
                    <span>Liên hệ mật thiết giữa cách mạng VN và thế giới</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* BEN PHAI - 3 MUC (layout tự nhiên hơn) */}

            {/* 3. Nội dung */}
            <div className="absolute top-[50px] right-[-40px] flex items-center gap-12">
              <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 flex-shrink-0 hover:scale-105 transition-all duration-500 animate-float-slow">
                <img 
                  src="/5.2.3.png" 
                  alt="Nội dung" 
                  className="w-full h-full object-cover scale-110 transform hover:scale-125 transition-transform duration-300"
                />
              </div>
              <div className="w-[400px] text-left">
                <h3 className="text-3xl font-bold text-yellow-300 mb-4">Nội dung</h3>
                <ul className="list-none text-white space-y-2 text-lg">
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-lg">•</span>
                    <span>Đoàn kết với phong trào cộng sản & công nhân</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-lg">•</span>
                    <span>Hợp tác với phong trào giải phóng dân tộc</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-lg">•</span>
                    <span>Đấu tranh vì hòa bình, công lý, tiến bộ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-lg">•</span>
                    <span>Mở rộng hữu nghị, hợp tác bình đẳng</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-lg">•</span>
                    <span>Tôn trọng chủ quyền – cùng phát triển</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 4. Nguyên tắc */}
            <div className="absolute top-[380px] right-[20px] flex items-center gap-9">
              <div className="w-52 h-52 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 flex-shrink-0 hover:scale-105 transition-all duration-500 animate-float-gentle">
                <img 
                  src="/5.2.4.png" 
                  alt="Nguyên tắc" 
                  className="w-full h-full object-cover scale-110 transform hover:scale-125 transition-transform duration-300"
                />
              </div>
              <div className="w-[420px] text-left">
                <h3 className="text-4xl font-bold text-yellow-300 mb-5">Nguyên tắc</h3>
                <ul className="list-none text-white space-y-3 text-xl">
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-xl">•</span>
                    <span>Độc lập – Tự chủ – Tự lực – Tự cường</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-xl">•</span>
                    <span>Bình đẳng – Tôn trọng lẫn nhau</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-xl">•</span>
                    <span>Cùng có lợi – Hợp tác chân thành</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-xl">•</span>
                    <span>Thủy chung trước sau như một</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-xl">•</span>
                    <span>Chống chia rẽ, cơ hội, hẹp hòi</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 5. Phương thức thực hiện */}
            <div className="absolute top-[720px] right-[-60px] flex items-center gap-7">
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 flex-shrink-0 hover:scale-105 transition-all duration-500 animate-float">
                <img 
                  src="/5.2.5.png" 
                  alt="Phương thức thực hiện" 
                  className="w-full h-full object-cover scale-110 transform hover:scale-125 transition-transform duration-300"
                />
              </div>
              <div className="w-[460px] text-left">
                <h3 className="text-3xl font-bold text-yellow-300 mb-4">Phương thức thực hiện</h3>
                <ul className="list-none text-white space-y-2 text-lg">
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-lg">•</span>
                    <span>Kết hợp sức mạnh dân tộc & thời đại</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-lg">•</span>
                    <span>Đa phương hóa, đa dạng hóa quan hệ</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-lg">•</span>
                    <span>Chủ động hội nhập, phát huy nội lực</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-lg">•</span>
                    <span>Đối thoại – Hợp tác – Cùng phát triển</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4 text-yellow-400 text-lg">•</span>
                    <span>Kiên định mục tiêu độc lập & CNXH</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

            {/* Nút mũi tên xuống để chuyển section */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
              <button
                onClick={() => scrollToNextSection('doan-ket-quoc-te')}
                className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform"
                aria-label="Chuyển đến section tiếp theo"
              >
                <ChevronDown className="w-8 h-8" />
              </button>
            </div>        </section>

        {/* Section: Câu hỏi suy ngẫm */}
        <section id="cau-hoi-suy-ngam" className="min-h-screen bg-gradient-to-br from-red-700 via-red-800 to-red-900 relative overflow-hidden">
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

          <div className="relative z-20 container mx-auto px-8 py-20 min-h-screen flex items-center">
            {/* Tiêu đề chính */}
            <div className="w-full">
              <div className="text-center mb-20">
                <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-4 tracking-wide">
                  CÂU HỎI SUY NGẪM
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto">
                  Thảo luận sâu sắc về tư tưởng Hồ Chí Minh trong bối cảnh lịch sử
                </p>
                <div className="w-32 h-1 bg-yellow-400 mx-auto mt-6"></div>
              </div>

              {/* Phần câu hỏi suy ngẫm */}
              <div className="max-w-4xl mx-auto px-6">
                <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-xl border-2 border-yellow-400/30 p-8 rounded-3xl shadow-2xl">
                  
                  
                  <div className="bg-black/50 rounded-2xl p-8 border border-yellow-400/20">
                    <div className="mb-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-lg font-black flex-shrink-0 mt-1">?</div>
                        <div>
                          <h4 className="text-yellow-300 font-bold text-2xl mb-4">Câu hỏi thảo luận:</h4>
                          <p className="text-white text-xl leading-relaxed mb-6">
                            Theo các bạn, khi xác định chủ thể của khối đại đoàn kết dân tộc, vì sao Hồ Chí Minh không lựa chọn chỉ đoàn kết trong giai cấp công nhân mà xác định là <span className="text-yellow-300 font-semibold">toàn thể nhân dân Việt Nam</span>? 
                          </p>
                          <p className="text-white text-xl leading-relaxed">
                            Điều này có đi ngược lại với lý luận quan điểm <span className="text-red-300 font-semibold">"Vô sản toàn thế giới, đoàn kết lại"</span> của Marx-Engels không?
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border-l-4 border-blue-400">
                      <h5 className="text-blue-300 font-semibold text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">💡</span> Gợi ý tư duy:
                      </h5>
                      <ul className="text-blue-100 space-y-2 text-lg">
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400 text-xl mt-1">•</span>
                          <span>Đặc điểm cụ thể của xã hội Việt Nam thời kỳ đầu thế kỷ XX</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400 text-xl mt-1">•</span>
                          <span>Mối quan hệ giữa giải phóng dân tộc và giải phóng giai cấp</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-blue-400 text-xl mt-1">•</span>
                          <span>Sự vận dụng sáng tạo chủ nghĩa Marx-Lenin vào điều kiện Việt Nam</span>
                        </li>
                      </ul>
                    </div>

                    {/* Nút xem câu trả lời */}
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setShowAnswerModal(true)}
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
                      >
                        <span className="text-2xl">💡</span>
                        XEM CÂU TRẢ LỜI
                        <span className="text-2xl">📖</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal câu trả lời */}
              {showAnswerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                  <div className="bg-gradient-to-br from-red-800 via-red-900 to-black max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border-4 border-yellow-400 shadow-2xl">
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
                          <span className="text-4xl">💡</span>
                          CÂU TRẢ LỜI CHI TIẾT
                        </h3>
                        <button
                          onClick={() => setShowAnswerModal(false)}
                          className="text-white hover:text-yellow-400 text-3xl font-bold transition-colors duration-300"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="space-y-6 text-white">
                        <div className="bg-black/50 rounded-2xl p-6 border border-yellow-400/30">
                          <h4 className="text-yellow-300 font-bold text-xl mb-4 flex items-center gap-2">
                            <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-lg font-black">I</span>
                            Vì sao Hồ Chí Minh xác định chủ thể của khối đại đoàn kết dân tộc là toàn thể nhân dân Việt Nam?
                          </h4>
                          <p className="text-lg leading-relaxed mb-4">
                            Việc Hồ Chí Minh xác định chủ thể của khối đại đoàn kết là <strong className="text-yellow-300">"toàn thể nhân dân Việt Nam"</strong> xuất phát từ sự am hiểu sâu sắc về điều kiện lịch sử và xã hội cụ thể của Việt Nam đầu thế kỷ XX:
                          </p>
                          
                          <div className="mb-6">
                            <h5 className="text-yellow-300 font-bold text-lg mb-3">📍 Đặc điểm cụ thể của xã hội Việt Nam thời kỳ đầu thế kỷ XX:</h5>
                            <ul className="space-y-3 text-base">
                              <li className="flex items-start gap-3">
                                <span className="text-yellow-400 text-xl mt-1">•</span>
                                <div>
                                  <strong className="text-yellow-200">Xã hội thuộc địa nửa phong kiến:</strong>
                                  <span className="text-white"> Mâu thuẫn chủ yếu là giữa toàn thể dân tộc Việt Nam với đế quốc xâm lược và bè lũ tay sai.</span>
                                </div>
                              </li>
                              <li className="flex items-start gap-3">
                                <span className="text-yellow-400 text-xl mt-1">•</span>
                                <div>
                                  <strong className="text-yellow-200">Giai cấp công nhân còn non trẻ:</strong>
                                  <span className="text-white"> Số lượng ít ỏi, chưa đủ sức mạnh đơn độc để đánh đổ ách thống trị thực dân.</span>
                                </div>
                              </li>
                              <li className="flex items-start gap-3">
                                <span className="text-yellow-400 text-xl mt-1">•</span>
                                <div>
                                  <strong className="text-yellow-200">Nông dân chiếm đại đa số:</strong>
                                  <span className="text-white"> Hơn 90% dân số, có tinh thần yêu nước nồng nàn và là động lực cách mạng to lớn.</span>
                                </div>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border-l-4 border-blue-400">
                            <h6 className="text-blue-300 font-bold text-base mb-2">🎯 Mối quan hệ giữa giải phóng dân tộc và giải phóng giai cấp:</h6>
                            <p className="text-blue-100 text-sm leading-relaxed">
                              Độc lập dân tộc là điều kiện tiên quyết để tiến tới giải phóng giai cấp. Hồ Chí Minh khéo léo kết hợp hai nhiệm vụ này, đặt giải phóng dân tộc lên hàng đầu.
                            </p>
                          </div>
                        </div>

                        <div className="bg-black/50 rounded-2xl p-8 border border-purple-400/30">
                          <h4 className="text-purple-300 font-bold text-2xl mb-6 flex items-center gap-3">
                            <span className="bg-purple-400 text-black rounded-full w-10 h-10 flex items-center justify-center text-xl font-black">II</span>
                            Có đi ngược với quan điểm "Vô sản toàn thế giới, đoàn kết lại" của Marx-Engels không?
                          </h4>
                          <p className="text-xl leading-relaxed mb-6 text-white">
                            Việc Hồ Chí Minh xác định chủ thể đại đoàn kết là toàn thể nhân dân Việt Nam <strong className="text-purple-300">không hề đi ngược lại</strong> mà thực chất là <strong className="text-purple-300">sự vận dụng sáng tạo</strong> chủ nghĩa Marx-Lenin vào điều kiện cụ thể của Việt Nam.
                          </p>
                          
                          {/* So sánh chi tiết */}
                          <div className="space-y-6">
                            <div className="bg-red-500/20 rounded-2xl p-6 border-2 border-red-400/40">
                              <h5 className="text-red-300 font-bold text-xl mb-4 flex items-center gap-3">
                                <span className="text-2xl">📚</span>
                                Quan điểm của Marx-Engels
                              </h5>
                              <div className="space-y-3">
                                <p className="text-white text-lg leading-relaxed">
                                  <strong className="text-red-200">"Vô sản toàn thế giới, đoàn kết lại!"</strong>
                                </p>
                                <p className="text-red-100 text-base leading-relaxed">
                                  Khẩu hiệu ra đời trong bối cảnh các nước tư bản phát triển ở châu Âu, nơi mâu thuẫn giữa giai cấp tư sản và vô sản đã trở thành mâu thuẫn chủ yếu và gay gắt nhất.
                                </p>
                              </div>
                            </div>
                            
                            <div className="bg-green-500/20 rounded-2xl p-6 border-2 border-green-400/40">
                              <h5 className="text-green-300 font-bold text-xl mb-4 flex items-center gap-3">
                                <span className="text-2xl">🇻🇳</span>
                                Sự vận dụng sáng tạo của Hồ Chí Minh
                              </h5>
                              <div className="space-y-3">
                                <p className="text-white text-lg leading-relaxed">
                                  <strong className="text-green-200">"Đại đoàn kết toàn dân tộc"</strong>
                                </p>
                                <ul className="text-green-100 space-y-2 text-base">
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-2">•</span>
                                    <span>Không cứng nhắc áp dụng y nguyên lý luận Marx-Engels</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-2">•</span>
                                    <span>Hiểu Marx-Lenin là kim chỉ nam cho hành động, không phải giáo điều</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-2">•</span>
                                    <span>Phân tích sâu sắc thực tiễn cách mạng Việt Nam</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-2">•</span>
                                    <span>Giai cấp công nhân lãnh đạo nhưng phải liên minh với các tầng lớp khác</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          {/* Điểm tương đồng */}
                          <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border-l-4 border-purple-400">
                            <div className="flex items-start gap-3">
                              <span className="text-3xl mt-1">🎯</span>
                              <div>
                                <h6 className="text-purple-300 font-bold text-lg mb-2">Mục tiêu chung:</h6>
                                <p className="text-white text-base leading-relaxed">
                                  Cả Marx-Engels và Hồ Chí Minh đều nhằm <strong className="text-purple-200">giải phóng con người khỏi mọi áp bức, bóc lột</strong>. 
                                  Chỉ có điều, <strong className="text-purple-200">con đường và phương pháp thực hiện có sự khác biệt</strong> để phù hợp với điều kiện lịch sử cụ thể.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/50">
                          <h4 className="text-yellow-300 font-bold text-xl mb-4 flex items-center gap-2">
                            <span className="text-3xl">🎯</span>
                            Kết luận
                          </h4>
                          <p className="text-lg leading-relaxed">
                            Tư tưởng đại đoàn kết toàn dân tộc của Hồ Chí Minh là <strong className="text-yellow-300">sự thể hiện rõ nét tầm vóc trí tuệ</strong> và sự vận dụng sáng tạo, linh hoạt chủ nghĩa Marx-Lenin vào hoàn cảnh đặc thù của Việt Nam. Người đã xác định đúng đắn lực lượng cách mạng, tập hợp sức mạnh của toàn dân tộc để thực hiện thắng lợi mục tiêu giải phóng dân tộc, <strong className="text-yellow-300">không đi ngược lại mà là sự phát triển phù hợp</strong> với những nguyên lý cơ bản của chủ nghĩa Marx-Lenin.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nút mũi tên xuống để chuyển section */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                <button
                  onClick={() => scrollToNextSection('cau-hoi-suy-ngam')}
                  className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform"
                  aria-label="Chuyển đến section tiếp theo"
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
                TƯ TƯỞNG HỒ CHÍ MINH VỀ ĐẠI ĐOÀN KẾT VÀ ĐOÀN KẾT QUỐC TẾ
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
                        style={{width: `${((currentQuiz + 1) / quizQuestions.length) * 100}%`}}
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
        <section id="prove" className="relative bg-gradient-to-br from-red-800 via-red-900 to-black py-20" data-reveal>
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
                      → Ảnh AI được dùng để minh họa khái niệm, timeline, poster mô phỏng phong cách cổ động, giúp nội dung hấp dẫn và trực quan hơn.
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
            <p className="text-yellow-100 mb-4">© 2026 - Tư tưởng Hồ Chí Minh về Đại đoàn kết toàn dân tộc và Đoàn kết quốc tế - Nhóm SPST2 - AI1807</p>
            <p className="text-yellow-300 text-sm">"Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công" - Chủ tịch Hồ Chí Minh</p>
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
