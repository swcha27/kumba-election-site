document.addEventListener('DOMContentLoaded', () => {
    // ===== 선거 일정 기반 동적 상태 관리 =====
    const SCHEDULE = {
        announcement: new Date('2025-11-11T00:00:00+09:00'),   // 선거 공고
        registration: new Date('2025-11-24T23:59:59+09:00'),   // 등록 마감
        campaign: new Date('2025-12-01T00:00:00+09:00'),       // 후보자 확정/선거운동 시작
        voteStart: new Date('2025-12-13T09:00:00+09:00'),      // 투표 시작
        voteEnd: new Date('2025-12-20T16:00:00+09:00')         // 투표 마감/개표
    };

    function updateElectionStatus() {
        const now = new Date();
        
        // 현재 단계 결정
        let phase = 'before'; // 선거 공고 전
        if (now >= SCHEDULE.voteEnd) {
            phase = 'ended';      // 투표 종료
        } else if (now >= SCHEDULE.voteStart) {
            phase = 'voting';     // 투표 진행 중
        } else if (now >= SCHEDULE.campaign) {
            phase = 'campaign';   // 선거운동 기간
        } else if (now >= SCHEDULE.announcement) {
            phase = 'registered'; // 후보 등록 기간
        }

        // 히어로 섹션 업데이트
        const heroStatus = document.getElementById('hero-status');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroLabel1 = document.getElementById('hero-label-1');
        const heroValue1 = document.getElementById('hero-value-1');

        // 공지사항 섹션 업데이트
        const noticeBadge = document.getElementById('notice-badge');
        const noticeTitle = document.getElementById('notice-title');
        const noticeMainText = document.getElementById('notice-main-text');
        const noticeVoteInfo = document.getElementById('notice-vote-info');

        // 타임라인 업데이트
        const timelineCampaign = document.getElementById('timeline-campaign');
        const timelineVote = document.getElementById('timeline-vote');
        const timelineResult = document.getElementById('timeline-result');
        const timelineVoteTitle = document.getElementById('timeline-vote-title');

        // 모든 타임라인 아이템 클래스 초기화
        [timelineCampaign, timelineVote, timelineResult].forEach(item => {
            if (item) {
                item.classList.remove('done', 'active');
            }
        });

        // 11.11, 11.24는 이미 done으로 고정 (HTML에서)

        switch (phase) {
            case 'campaign':
                // 선거운동 기간 (12.01 ~ 12.13 09:00 전)
                if (heroStatus) heroStatus.textContent = '회장단 후보자 확정 공지';
                if (heroSubtitle) heroSubtitle.textContent = '새로운 도약, 함께하는 미래';
                if (heroLabel1) heroLabel1.textContent = '선거운동';
                if (heroValue1) heroValue1.textContent = '12.01 - 12.12';
                
                if (noticeBadge) noticeBadge.textContent = 'D-' + getDday(SCHEDULE.voteStart);
                if (noticeTitle) noticeTitle.textContent = '후보자 확정 및 공약 공지';
                if (noticeMainText) noticeMainText.innerHTML = '제3대 회장단 입후보자가 확정되었습니다.<br>각 후보자의 비전과 공약을 확인하고, <strong>12월 13일 오전 9시부터</strong> 진행되는 온라인 투표에 참여해 주세요.';
                if (noticeVoteInfo) noticeVoteInfo.innerHTML = '⏰ <strong>투표 예정:</strong> 12월 13일(토) 09:00 ~ 12월 20일(토) 16:00<br>📧 등록된 이메일로 투표 링크가 발송됩니다.';

                if (timelineCampaign) timelineCampaign.classList.add('active');
                if (timelineVoteTitle) timelineVoteTitle.textContent = '투표 시작';
                break;

            case 'voting':
                // 투표 진행 중 (12.13 09:00 ~ 12.20 16:00)
                if (heroStatus) heroStatus.textContent = '회장단 온라인 투표 진행 중';
                if (heroSubtitle) heroSubtitle.textContent = '소중한 한 표로 KUMBA의 미래를 결정해 주세요!';
                if (heroLabel1) heroLabel1.textContent = '🗳️ 투표 진행 중';
                if (heroValue1) heroValue1.textContent = getRemainingTime(SCHEDULE.voteEnd);
                
                if (noticeBadge) noticeBadge.textContent = '🗳️ 투표 진행 중';
                if (noticeTitle) noticeTitle.textContent = '온라인 투표 안내';
                if (noticeMainText) noticeMainText.innerHTML = '제3대 KUMBA 총동문회 회장단 <strong>온라인 투표가 진행 중</strong>입니다!<br>아래 후보자들의 비전과 공약을 확인하시고, <strong>12월 20일(토) 16시 마감 전까지</strong> 소중한 한 표를 행사해 주세요.';
                if (noticeVoteInfo) {
                    noticeVoteInfo.style.background = '#e8f5e9';
                    noticeVoteInfo.innerHTML = '📧 <strong>투표 방법:</strong> 등록된 이메일로 발송된 투표 링크를 통해 투표해 주세요.<br>⏰ <strong>마감:</strong> 12월 20일(토) 오후 4시 | 문의: 2019kumba@gmail.com';
                }

                if (timelineCampaign) timelineCampaign.classList.add('done');
                if (timelineVote) timelineVote.classList.add('active');
                if (timelineVoteTitle) timelineVoteTitle.textContent = '🗳️ 투표 진행 중';
                break;

            case 'ended':
                // 투표 종료
                if (heroStatus) heroStatus.textContent = '회장단 선거 투표 마감';
                if (heroSubtitle) heroSubtitle.textContent = '투표에 참여해 주신 모든 동문 여러분께 감사드립니다.';
                if (heroLabel1) heroLabel1.textContent = '✅ 투표 마감';
                if (heroValue1) heroValue1.textContent = '결과 발표 대기';
                
                if (noticeBadge) noticeBadge.textContent = '✅ 투표 마감';
                if (noticeTitle) noticeTitle.textContent = '투표가 마감되었습니다';
                if (noticeMainText) noticeMainText.innerHTML = '제3대 KUMBA 총동문회 회장단 온라인 투표가 마감되었습니다.<br>정기총회에서 당선자가 발표됩니다. 참여해 주신 모든 동문 여러분께 감사드립니다.';
                if (noticeVoteInfo) {
                    noticeVoteInfo.style.background = '#fff3e0';
                    noticeVoteInfo.innerHTML = '📢 <strong>당선자 발표:</strong> 12월 20일(토) 정기총회에서 발표됩니다.';
                }

                if (timelineCampaign) timelineCampaign.classList.add('done');
                if (timelineVote) timelineVote.classList.add('done');
                if (timelineResult) timelineResult.classList.add('active');
                if (timelineVoteTitle) timelineVoteTitle.textContent = '✅ 투표 완료';
                break;

            default:
                // 선거운동 전 (기본값)
                if (heroStatus) heroStatus.textContent = '회장단 선거 안내';
                if (heroSubtitle) heroSubtitle.textContent = '새로운 도약, 함께하는 미래';
        }
    }

    // D-day 계산
    function getDday(targetDate) {
        const now = new Date();
        const diff = targetDate - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    }

    // 남은 시간 계산
    function getRemainingTime(targetDate) {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) return '마감';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) {
            return `마감까지 ${days}일 ${hours}시간`;
        } else {
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return `마감까지 ${hours}시간 ${minutes}분`;
        }
    }

    // 초기 실행 및 1분마다 업데이트
    updateElectionStatus();
    setInterval(updateElectionStatus, 60000);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .notice-card, .candidate-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Add visible class styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
            if (nav.style.display === 'flex') {
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '80px';
                nav.style.left = '0';
                nav.style.width = '100%';
                nav.style.backgroundColor = 'white';
                nav.style.padding = '20px';
                nav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }
        });
    }
});
