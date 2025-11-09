// ===== グローバル変数 =====
let currentTab = 'top';

// ===== タブ切り替え機能 =====
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // すべてのdata-tab属性を持つ要素にイベントを追加
    const allTabTriggers = document.querySelectorAll('[data-tab]');
    
    allTabTriggers.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTab);
            
            if (targetContent) {
                // すべてのタブとコンテンツの active を削除
                navItems.forEach(nav => nav.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // 対応するナビゲーションアイテムをアクティブに
                const correspondingNavItem = document.querySelector(`.nav-item[data-tab="${targetTab}"]`);
                if (correspondingNavItem) {
                    correspondingNavItem.classList.add('active');
                }
                
                // ターゲットのコンテンツをアクティブに
                targetContent.classList.add('active');
                currentTab = targetTab;
                
                // モバイルでスクロール
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        const contentArea = document.querySelector('.content-area');
                        if (contentArea) contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        });
    });
}

// ===== FAQ機能 =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });
}

// ===== 訪問者カウンター =====
function initVisitorCounter() {
    const countElement = document.getElementById('visitorCount');
    const textElement = document.getElementById('visitorText');
    if (!countElement || !textElement) return;
    
    try {
        // 訪問者の一意IDを取得または生成
        let visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
            // 新規訪問者：一意のIDを生成
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitorId', visitorId);
        }
        
        // 訪問者リストを取得（グローバルストレージとして使用）
        let visitorList = [];
        const storedList = localStorage.getItem('globalVisitorList');
        if (storedList) {
            try {
                visitorList = JSON.parse(storedList);
            } catch (e) {
                visitorList = [];
            }
        }
        
        // このvisitorIdがリストに存在しない場合のみ追加
        if (!visitorList.includes(visitorId)) {
            visitorList.push(visitorId);
            localStorage.setItem('globalVisitorList', JSON.stringify(visitorList));
        }
        
        // カウントを表示
        const count = visitorList.length;
        countElement.textContent = count;
        
        // 多言語対応のテキスト表示
        const currentLang = localStorage.getItem('language') || 'ja';
        if (currentLang === 'ja') {
            textElement.textContent = `あなたは${count}人目の訪問者です`;
        } else if (currentLang === 'en') {
            textElement.textContent = `You are visitor #${count}`;
        } else if (currentLang === 'zh') {
            textElement.textContent = `您是第${count}位访客`;
        }
        
    } catch (error) {
        console.error('訪問者カウンターエラー:', error);
        countElement.textContent = '---';
        textElement.textContent = 'カウント取得中...';
    }
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
        }, 500);
    });
}

function updateBreadcrumbEnhanced(tabId) {
    const breadcrumb = document.querySelector(`#${tabId} .breadcrumb`);
    if (!breadcrumb) return;
    const tabNames = {
        'top': 'TOP', 'news': '最新の活動報告', 'gallery': '活動ギャラリー',
        'roadmap': '初めての方へ', 'profile': 'プロフィール', 'sns': 'SNS',
        'activity': 'ブログアクセス', 'goods': 'グッズ', 'support': 'RC支援・サポート',
        'testimonials': 'サポートを受けた方の声', 'faq': 'よくある質問', 'contact': 'お問い合わせ'
    };
    const tabIcons = {
        'top': '🏠', 'news': '📰', 'gallery': '📸', 'roadmap': '🛤️',
        'profile': '👤', 'sns': '📱', 'activity': '📰', 'goods': '🛍️',
        'support': '🤝', 'testimonials': '🎉', 'faq': '❓', 'contact': '✉️'
    };
    if (tabId === 'top') {
        breadcrumb.innerHTML = `<span class="breadcrumb-item">${tabIcons[tabId]} ${tabNames[tabId]}</span>`;
    } else {
        breadcrumb.innerHTML = `
            <a href="#" class="breadcrumb-link" data-tab="top">${tabIcons['top']} ${tabNames['top']}</a>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-item">${tabIcons[tabId]} ${tabNames[tabId]}</span>
        `;
        
        // パンくずリストのリンクにイベントリスナーを追加
        const breadcrumbLink = breadcrumb.querySelector('.breadcrumb-link');
        if (breadcrumbLink) {
            breadcrumbLink.addEventListener('click', function(e) {
                e.preventDefault();
                const targetTab = this.getAttribute('data-tab');
                
                // TOPタブをアクティブにする
                const navItems = document.querySelectorAll('.nav-item');
                const tabContents = document.querySelectorAll('.tab-content');
                
                navItems.forEach(nav => nav.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                const topNavItem = document.querySelector(`.nav-item[data-tab="top"]`);
                const topContent = document.getElementById('top');
                
                if (topNavItem) topNavItem.classList.add('active');
                if (topContent) topContent.classList.add('active');
                
                currentTab = 'top';
                
                // モバイルでスクロール
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        const contentArea = document.querySelector('.content-area');
                        if (contentArea) contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            });
        }
    }
}

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') document.body.classList.add('dark-mode');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

function initScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    const animatedElements = document.querySelectorAll('.greeting-card, .card, .faq-item, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

async function initVisitorStats() {
    console.log('訪問者統計機能：準備完了');
}

function initSiteSearch() {
    const searchInput = document.getElementById('siteSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    if (!searchInput || !searchBtn || !searchResults) return;
    const searchableContent = [
        { tab: 'top', title: 'TOP', keywords: ['ぽすとそに', '工房'] },
        { tab: 'faq', title: 'よくある質問', keywords: ['FAQ', '質問'] }
    ];
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) { searchResults.style.display = 'none'; return; }
        const results = searchableContent.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.keywords.some(keyword => keyword.toLowerCase().includes(query))
        );
        if (results.length > 0) {
            searchResults.innerHTML = results.map(result =>
                `<div class="search-result-item" data-tab="${result.tab}">📄 ${result.title}</div>`
            ).join('');
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="search-no-results">検索結果が見つかりませんでした</div>';
            searchResults.style.display = 'block';
        }
    }
    searchBtn.addEventListener('click', performSearch);
}

// ===== 完全な翻訳データ =====
const translations = {
    ja: {
        title: 'ぽすとそに工房',
        subtitle: 'RC技術と情熱の融合 - 次世代へ繋ぐラジコン文化',
        nav: {
            top: 'TOP', news: '最新の活動報告', gallery: '活動ギャラリー',
            roadmap: '初めての方へ', profile: 'プロフィール', sns: 'SNS',
            activity: 'ブログアクセス', goods: 'グッズ', support: 'RC支援・サポート',
            testimonials: 'サポートを受けた方の声', faq: 'よくある質問', contact: 'お問い合わせ'
        },
        sidebar: {
            searchTitle: 'サイト内検索',
            searchPlaceholder: 'FAQやブログ記事を検索',
            searchButton: '検索',
            tocTitle: '目次'
        },
        newsSection: {
            title: '最新の活動報告',
            comingSoon: 'Coming Soon...',
            workInProgress: 'ホームページの翻訳作業をしております。少々お待ちください。'
        },
        gallerySection: {
            title: '今までの活動ギャラリー',
            caption1: '平成初期の陸モノOSエンジンを分解清掃メンテで再始動可能を確認しました。',
            caption2: 'こちらは変速ギアがなめています',
            caption3: '変速ギアを交換し、走行チェック後変速タイミングの設定完了',
            caption4: '過去の動画でヘリが墜落した瞬間の切り抜き（私の機体で墜落した機体名はJRのE8です。なかなか今から見ると古くなってきた機体でパーツも少ないです。）',
            caption5: '現在発売されているヘリとMIXして、飛行可能状態にしております。詳しくはYouTubeの遊覧フライト動画にて閲覧可能です。',
            caption6: 'K110Sを分解清掃メンテを行い、マストの軸が見えないレベルでずれていることを確認。修理中の画像です。',
            caption7: '次世代のファンフライ機の制作です。作成の説明書は日本語ではありません、少々難しい図面でも作成しております。（バルサ機も同じように行えます。）',
            badgeBefore: '修理前',
            badgeAfter: '修理後',
            badgeCompleted: '修理完了',
            badgeCrashed: '墜落直後'
        },
        roadmapSection: {
            title: 'ラジコンを始める5つのステップ',
            intro: 'RCを始めたい方、復帰したい方に向けた、安心のステップガイドです。あなたのペースに合わせてサポートします。',
            step1Title: '💬 相談',
            step1Item1: '初期にかかるRCに対しての費用相談！',
            step1Item2: '連絡に気づき次第即日決定を目指します！（悩まれる場合は、もちろんゆっくりで問題ございません。）',
            step1Item3: '具体的にあなたの興味がわいたラジコンの種類の話を聞きます、それを元に何が必要かを一緒に検討します。',
            step2Title: '🎯 選ぶRCジャンル',
            step2Item1: '選んだジャンルにおいての平均の始める初期費用を概算で出しつつ、相談を続けます。',
            step2Item2: '同じく即日決定を目指します！（ここで悩まれても、ゆっくりペースを合わせます。）',
            step2Item3: '初心者なのか、復帰者なのかを区分けし、レベルに応じて選ぶRCの選定を一緒に検討します。',
            step3Title: '🤝 購入後のサポート',
            step3Item1: '選んだ内容に応じたRCの走行、飛行可能な場所を一緒に検討します。（事前検討も可能です。）',
            step3Item2: '近場のクラブを一緒に検討します。（クラブはまだ…という方にも場所のアドバイスを続けます。）',
            step3Item3: '現在の法律に合わせて、適切な場所を選びます。',
            step3Item4: '近場であれば、一人ひとりに合わせて場所を決めて待ち合わせなどをし、一緒に走るところや飛行するところを見て怖くないようにサポートします。（遠方であれば、初めて遊んだときにどのようなことが起きたか困ったかなどを聞き、改善をサポートします。）',
            step4Title: '🔧 基本メンテナンス',
            step4Item1: 'メンテナンスに必要なものを、お好きなRCに合わせて予算別で一緒に検討します。（おすすめを今までの私の知識とAIを合わせて、主観が入らないように適切なものを選んでいきます。もちろん、事前検討も可能です。）',
            step4Item2: 'メンテナンスの基礎知識などをお伝えし、自分でもRCを触れるようにサポートします。',
            step5Title: '🚀 RCの世界へ',
            step5Item1: 'STEP1～4まで終えた方はおそらく1人でも遊べる状況になっているはずです。復帰者のパターンでも、現在のRCの知識に追いつける状態にまでなっていると思われます。',
            step5Item2: '近場であれば、お困りの際はいつでもお声をかけてください。遠方でも、同じくなるべくすぐに対応します。',
            step5Item3: 'これでRCについての初期段階は終了です！マイペースに遊ぶもよし、たくさん練習するもよし、いざRCの世界へ！',
            note: '※目安のSTEPです。それぞれの遊び方のニーズに合わせてどこまでも真摯に向き合います。いつでもお問い合わせフォームからご連絡ください。'
        },
        profileSection: {
            title: 'プロフィール',
            nameLabel: '名前',
            nameValue: 'ぽすとそに',
            ageLabel: '年齢',
            ageValue: '33歳 (2025年現在)',
            expertiseLabel: '専門分野',
            expertiseList: [
                'ラジコン（カー、飛行機、ヘリ）の操作',
                '設計（カー、飛行機）',
                '修理（カー、各種メカ類）',
                '基礎知識サポート（安全のための配慮etc...）'
            ],
            specialtyLabel: '特技',
            specialtyList: [
                'ラジコンとAIの融合',
                '最新機種などの情報収集',
                'メカ類の相性などの細かな部分'
            ],
            philosophyLabel: '活動理念',
            philosophyValue: 'AI技術とRC文化の融合により、次世代へ技術を継承',
            achievementsTitle: '📊 今までの活動',
            achievement1Number: '100+',
            achievement1Label: '陸モノ修理',
            achievement1Sublabel: '車種以上',
            achievement2Number: '30+',
            achievement2Label: 'メカ類修理',
            achievement2Sublabel: '件以上',
            achievement3Number: '20+',
            achievement3Label: '空モノ修理',
            achievement3Sublabel: '件以上',
            achievement4Number: '18年',
            achievement4Label: 'RC活動歴',
            achievement4Sublabel: '経験豊富',
            achievement5Number: '2年',
            achievement5Label: 'サポート活動',
            achievement5Sublabel: '継続中',
            achievement6Number: '20社',
            achievement6Label: '対応メーカー',
            achievement6Sublabel: '多様な経験',
            makersTitle: '🔧 対応可能メーカー（一部）',
            makersNote: '※記載以外のメーカーもお気軽にご相談ください'
        },
        snsSection: {
            title: 'SNS・チャンネル',
            youtubeTitle: 'YouTube チャンネル',
            youtubeDescription: 'RC製作・飛行動画を配信中',
            youtubeNote: '（私が所有・運営しています）',
            youtubeBannerGuide: '↑↑上記バナーをクリックorタップでチャンネルに飛びます↑↑',
            xTitle: 'X（旧Twitter）',
            xDescription: 'RC活動の日々の記録や最新情報を発信中',
            xBannerGuide: '↑↑上記バナーをクリックorタップでXに飛びます↑↑'
        },
        activitySection: {
            title: '活動記録',
            blogTitle: '📖 技術ブログ（note）',
            blogDescription: '修理工程、パーツレビュー、技術的な備忘録など、SNSでは伝えきれない詳細な情報を発信しています。',
            noteTitle: 'note',
            noteDescription: '修理工程や技術解説を詳しく記録中',
            latestArticlesTitle: '📌 最新のブログ記事',
            moreArticles: 'もっと記事を見る →'
        },
        goodsSection: {
            title: 'グッズ',
            comingSoon: '🚧 準備中です 🚧',
            description: 'オリジナルグッズや情報が詰まったPDFファイルなどを今後展開予定です。',
            notice: '※このサイトでは商品の販売や注文受付は行っておりません。展開先は別の外部サービスを使います。'
        },
        supportSection: {
            title: 'RC支援・サポートについて',
            mainTitle: 'RC初心者の方へのサポート',
            support1Icon: '✏️',
            support1Title: '初心者の方たちへの支援',
            support1Description: 'ラジコンを初めて触る人にも優しく丁寧にプランを一緒に試行錯誤します。',
            support2Icon: '🔧',
            support2Title: '修理メンテナンスについて',
            support2Description: '基礎的なメンテナンスや修理を一緒に行います。高度な修理については、お問い合わせからご連絡お願いします。どうしても出来ないものもありますが、それらの理由なども誠実にお答えします。',
            support2Detail: 'あまりにも修理が高額なラジコンや、パーツが別途必要で入手不可という特殊事例は、近場の修理店などを紹介して解決に向かうこともあります。（パーツがすでにあるorパーツを購入できるという条件が既にありましたら、私が直すことも可能です。）',
            support2Example: '※修理が高額なラジコンの一例：ラジコン飛行機の墜落→メカトラブルの点検＋微細な割れの発見＋木材の調達＋フィルムや塗装直し＋乾燥を待つことによる時間のかかる工程＋最終チェックと仕上げetc',
            support2ExampleNote: '（詳しくはお問い合わせください。）',
            support3Icon: '🎓',
            support3Title: '操縦技術の向上',
            support3Description: '私もまだ若輩者なので、全ての操作ができるわけではありません。しかし、タミグラやF3A、F3Cについては少々理解のある方かと思われます。（操縦技術は大目に見ていただけると助かります。）',
            support3Detail: 'その人に合った最適な練習方法や、欲しい商品と自分の手持ちのラジコンを比較しながらの向上練習or商品の購入順番の最適化をAIを活用しながら、最後に笑顔になれるように尽力します。',
            conversationExample: '※ラジコン飛行機とラジコンカー、どちらも好きだけど、どちらも中途半端だからどのようにそれぞれ時間を割くのが自分には向いてたりするんですか？',
            conversationAnswer: '→〇〇に何割、〇〇に何割、自分との心次第では一部変わりますが、恐らく納得いくのではないかと思われる形は〇〇な状態かと思われます！ですので、今は〇〇が必要ではなく実は〇〇の考え方が重要かもしれませんので、時間をかけてゆっくり練習しましょう！〇〇週間後に自分ここまでできた、などありましたら、〇〇を購入してみるのもまた一つの手かもしれませんね(*´ω｀)',
            support3DetailEnd: 'などという形式で、一人ひとりに向き合います。（お助けにならなかったり、過度に干渉してしまった場合は大変申し訳ございません。いつでもおっしゃっていただければ、本音は真剣に受け止めます。）',
            note: '詳細はお問い合わせください'
        },
        testimonialsSection: {
            title: 'サポートを受けた方の声',
            intro: '実際にサポートを受けてくださった方々の体験談です。ホームページ開設にあたり、ご協力いただきました。',
            testimonial1Name: 'Yさんの体験談',
            testimonial1Tag: '10代・未経験・陸モノ（バギー）',
            testimonial1Text: '個人的には、バギーの中でも旧車が好きでした。しかし、旧車にはパーツ問題などが多く初めていいものか分かりませんでした。しかし、新旧合わせてパーツを確保し今では練習には2台とも愛車になりました。難しいアンプのセッティングも場所を変えてPCから操作方法を学び、自分でもできるようになりました。いつも一緒に走ってくれたり、コツなども伝えてくれて感謝の限りです。',
            testimonial2Name: 'Oさんの体験談',
            testimonial2Tag: '50代・復帰者・陸モノ＆空モノ',
            testimonial2Text: '突然の飛び込みの修理で、原因が初期不良で購入店にあることが分かり、すぐに購入店に新品に交換してもらえました。それからは各種設定や久しぶりのラジコンで浦島太郎状態なのにも関わらず、今のラジコンについての知識を精一杯教えてもらい、四苦八苦ではありましたがなんとか覚えることが出来ました。今では次のステップである飛行機を飛ばすために相談を続けていますが、LINEなども使ってメールよりも迅速にお返事がくるので解決が早く嬉しいです。今度飛ばすときは是非ご一緒していただきたいです。ありがたい限りです。',
            testimonial3Name: 'Kさんの体験談',
            testimonial3Tag: '60代・経験者・空モノ（飛行機、ヘリ）',
            testimonial3Text: '経験していても、情報についていくことが難しく、どのように設定したらいいか分からないときがあります。しかし横で説明書をみながら、私のレベルに合わせた最適なセッティングを出していただき、飛ばしては降りてすぐに調整を繰り返し、私にもできなかったことがすぐに理解できました。お陰様でメインは飛行機でしたがヘリも楽しいものですね、はまってしまいました。まだホバリングぐらいしかできませんが、ここまで歳をとっても新しい発見があることはとても貴重です。有難うございます。',
            testimonial4Name: 'Aさんの体験談',
            testimonial4Tag: '30代・ドローン歴2年・空モノ（ヘリ）',
            testimonial4Text: 'ドローンは飛ばしたこともありましたが、ラジコンヘリの難しさは別格です。最初は離陸すら難しく怖がりながらやりましたね。全て1から10まで懇切丁寧に教えていただきありがとうございます。もっと時間のかかる成長しかできないと思っていましたが、仕組みを理解しながら飛ばしていくうちにどんどん安定し、ホバリングと旋回程度なら私にもできます。ぽすとそにさんのような難しいスキルはまだありませんが、いずれ追いついて抜かせるぐらいどっぷりとハマってしまいました笑、ぜひご一緒しながら温かいお茶でも飲み、ラジコン談義しつつ一緒にラジコン楽しみましょう！',
            testimonial5Name: 'Sさんの体験談',
            testimonial5Tag: '30代・未経験・陸モノ',
            testimonial5Text: '最初はバギー一択で大会に出るんだと言いましたね。しかし、私はその気持ちばかり先行し、童心の夢中さを忘れていたようです。もちろん速さもたのしいですが、今の車種にはこんなに振り回しても故障が少ないモデルもあるとは知らなかったです。もちろん私の整備のスキルを上げてくれたことも一因ですね笑。今ではたまに速いバギーを走らせつつ一緒にメンテナンスをしてもらったり、オフロードトラックも頑丈にカスタマイズを自分なりにも進めております。まさかその手があったとは！と毎度驚かされます。若くても知識が豊富過ぎて、私の手の届かない範囲も手助けをしてくださり、いつもありがとうございます。'
        },
        faqSection: {
            title: 'よくある質問コーナー',
            intro: '皆様からよくいただく質問をまとめました。気になることがあれば、まずこちらをご覧ください。',
            q1: '完全初心者ですが大丈夫ですか？',
            a1: 'もちろんです。何もわからなくても問題ございません！',
            q2: 'ラジコンを始めるには、どれくらいの費用がかかりますか？',
            a2: 'お問い合わせいただいた内容をもとに、ラジコンを始める際に必要となる費用の目安を一緒に考えます。実際のお買い物はご自身でしていただく形になりますが、「だいたいこれくらいかな？」という基準を決めたり、それらを選ぶときは相談者のレベルに応じたものをベースに致します。「楽しさを広げる」ことをモットーに、無理のないスタートを応援しています！',
            q3: 'どこで活動していますか？対応エリアは？',
            a3: '札幌が基本となります。ネット対応も可能な限り致します。',
            q4: 'どんなラジコンに対応していますか？',
            a4: '車、飛行機、ヘリ、戦車、トラック、ボート、トイラジ（対象年齢が低いラジコンなどを指します。）です。ドローンは要相談です。',
            q5: 'AIってどう使うんですか？',
            a5: '最適な機体選びや練習プラン作成に活用します。',
            q6: '修理にはどのくらい時間がかかりますか？',
            a6: '物によりますが、即日出来上がることが多いです。大きいものかつパーツのお取り寄せまでになると、約1か月ぐらいの場合もあります。工程が多いほど要相談です。',
            q7: 'オンラインでも相談できますか？',
            a7: 'もちろんです。概要を詳しく知りたい、お試しでお問い合わせしてみた、なども是非お待ちしております。',
            q8: '古い機体でも対応できますか？',
            a8: '可能な限り対応します。（パーツがなくとも自作していく場合もございます。）一例としては、初代タミヤ発売のホーネットを修理し、Uコンの一部も修理しました。',
            q9: '一緒に活動できますか？',
            a9: '人はたくさんいたほうが活気づくので、あくまでも私と同じく理念を元に活動することも可能です！',
            q10: 'クラブへの加入も検討しているのですが…',
            a10: '自身に合わせたレベルの近場のクラブの紹介や、近場であれば私の所属しているクラブを紹介することも可能です。私のところのクラブでは、コースや飛行場を利用するにあたってビジター料金などもございますので、お気軽に質問お待ちしております。'
        },
        contactSection: {
            title: 'お問い合わせ',
            description1: 'お問い合わせは以下のフォームからお願いいたします。',
            description2: 'RC関連のご質問、修理のご依頼、サポートのご相談など、お気軽にお問い合わせください。',
            notice: '※このフォームは商業目的ではなく、個人活動に関するお問い合わせ専用です。',
            buttonText: '📧 お問い合わせフォームを開く'
        },
        topSection: {
            title: 'ようこそ、ぽすとそに工房へ',
            greetingTitle: 'ぽすとそに ご挨拶',
            greeting: [
                'はじめまして。「ぽすとそに」と申します。2025年現在、33歳の男性であり、まだ若輩者ではございますが、AI技術を積極的に取り入れながら、ラジコン(以下、RC)の魅力と技術を広めていきたいと考えております。',
                '私は、心身ともにいくつかの制約を抱えながらも、それを理由に立ち止まるのではなく、AIという新たな可能性を通じて乗り越えようと日々取り組んでおります。',
                'RCという世界は、単なる「趣味」にとどまらず、機械と人の感覚が交わるリアルの領域だと感じています。人によっては便利さが進むほどに寂しさを覚える現代社会において、RCは手に取れる技術と体験が共存する、温かみのある文化だと思うのです。',
                '私は、このRCの魅力を次の世代へと繋ぐ一人の担い手でありたいと考えています。現代技術と人の情熱が交わる場所にこそ、次の時代に残す価値があると信じています。',
                '「ぽすとそに工房」では、私自身のRC活動の記録や試行錯誤の軌跡を発信しております。もしご興味をお持ちいただけましたら、ぜひ一度ご覧ください。そこには、懐かしさと近未来が共存する不思議な世界が広がっています。',
                'RCが持つ本来の楽しさと、その奥にある「人と技術の融合の美しさ」を、今後も発信し続けてまいります。'
            ],
            rcCollectionTitle: 'これは、ぽすとそに自身が所有しているラジコンの一部です',
            imageCaption1: 'JR PROPO E8 を修理したりメンテナンスしていく うちにMIXされた他機種からの流用パーツがてんこ盛りになったヘリと、EPPの入門用高翼機たちです。',
            imageCaption2: 'INFERNO MP9 TKI3をベースにボディの塗装を変えて懐かしい色合いにした状態です。',
            imageCaption3: 'RC-Factory Super Extra Lの組み立て前写真で、組み立て動画はYouTubeにあがっています。',
            galleryButtonText: '活動ギャラリーをもっとみる',
            statsTitle: '数字で見る分かりやすい活動記録',
            stat1Number: '18年', stat1Label: 'RC活動歴',
            stat2Number: '100+', stat2Label: '修理依頼により<br>直ったラジコンの数',
            stat3Number: '20社+', stat3Label: '対応メーカー',
            stat4Number: '2年間', stat4Label: 'サポート活動',
            monthlyTitle: '📅 今月の活動',
            monthlyUpdated: '2025年10月29日更新',
            monthlyRepairsTitle: '修理・改善されたラジコン',
            monthlyRepairsCount: '3台',
            monthlySupportedTitle: 'サポートした人数',
            monthlySupportedCount: '3名',
            monthlyNewModelTitle: '新作機体',
            monthlyNewModelDetail: 'RC-Factory Super Extra Lの作成',
            monthlyNewsTitle: '新着その他情報',
            monthlyNewsDetail: 'Heli-Xのシミュレーター調整、RealFlight Evolutionの新機体導入とモデル設定',
            ctaContact: 'ご相談はこちらから'
        }
    },
    en: {
        title: 'Postsoni Workshop',
        subtitle: 'RC Technology & Passion',
        nav: {
            top: 'TOP', news: 'Latest Updates', gallery: 'Gallery',
            roadmap: 'For Beginners', profile: 'Profile', sns: 'SNS',
            activity: 'Blog', goods: 'Goods', support: 'Support',
            testimonials: 'Testimonials', faq: 'FAQ', contact: 'Contact'
        },
        sidebar: {
            searchTitle: 'Site Search',
            searchPlaceholder: 'Search FAQ or blog articles',
            searchButton: 'Search',
            tocTitle: 'Table of Contents'
        },
        newsSection: {
            title: 'Latest Updates',
            comingSoon: 'Coming Soon...',
            workInProgress: 'We are working on translating the website. Please wait a moment.'
        },
        gallerySection: {
            title: 'Activity Gallery',
            caption1: 'Confirmed restart of early Heisei era land OS engine after disassembly, cleaning and maintenance.',
            caption2: 'This gear is worn out',
            caption3: 'Replaced the transmission gear, completed gear timing settings after running check',
            caption4: 'Frame from past video of helicopter crash (My crashed aircraft is JR E8. It\'s becoming quite old now with few parts available.)',
            caption5: 'Mixed with currently available helicopters to make it flight-ready. Details available in YouTube flight videos.',
            caption6: 'Disassembled and cleaned K110S, confirmed mast shaft misalignment at invisible level. Photo during repair.',
            caption7: 'Building next-generation fun fly aircraft. Instructions are not in Japanese, but we can build even with difficult diagrams. (Same process for balsa aircraft.)',
            badgeBefore: 'Before Repair',
            badgeAfter: 'After Repair',
            badgeCompleted: 'Repair Complete',
            badgeCrashed: 'Just Crashed'
        },
        roadmapSection: {
            title: 'Getting Started with RC in 5 Steps',
            intro: 'A reliable step guide for those who want to start or return to RC. We support you at your own pace.',
            step1Title: '💬 Consultation',
            step1Item1: 'Initial cost consultation for RC!',
            step1Item2: 'We aim for same-day decision once we notice your contact! (If you need time to think, no problem at all.)',
            step1Item3: 'We listen to what type of RC interests you and together determine what you need.',
            step2Title: '🎯 Choose RC Genre',
            step2Item1: 'We provide average initial cost estimates for your chosen genre while continuing consultation.',
            step2Item2: 'We also aim for same-day decision here! (If you need more time, we match your pace.)',
            step2Item3: 'We identify whether you\'re a beginner or returning hobbyist and help select RC models appropriate for your level.',
            step3Title: '🤝 Post-Purchase Support',
            step3Item1: 'We discuss suitable driving/flying locations based on your chosen RC. (Pre-planning possible.)',
            step3Item2: 'We help find nearby clubs. (For those not ready for clubs, we continue to advise on locations.)',
            step3Item3: 'We select appropriate locations according to current regulations.',
            step3Item4: 'For nearby areas, we can meet at agreed locations and support you by observing running/flying to ensure comfort. (For remote areas, we listen to what happened during first use and support improvements.)',
            step4Title: '🔧 Basic Maintenance',
            step4Item1: 'We discuss maintenance requirements for your RC within different budgets. (We combine my experience and AI to select appropriate items objectively. Pre-planning possible.)',
            step4Item2: 'We share basic maintenance knowledge to help you handle your RC yourself.',
            step5Title: '🚀 Into the RC World',
            step5Item1: 'Those who complete STEP 1-4 should be able to enjoy RC independently. Returning hobbyists should also be up to date with current RC knowledge.',
            step5Item2: 'For nearby areas, feel free to contact us anytime. For remote areas, we respond as quickly as possible.',
            step5Item3: 'This completes the initial stage! Enjoy at your own pace or practice extensively - welcome to the RC world!',
            note: '※This is a guideline. We sincerely work with you according to your play style needs. Please contact us anytime through the contact form.'
        },
        profileSection: {
            title: 'Profile',
            nameLabel: 'Name',
            nameValue: 'Postsoni',
            ageLabel: 'Age',
            ageValue: '33 years old (as of 2025)',
            expertiseLabel: 'Expertise',
            expertiseList: [
                'RC operation (cars, planes, helicopters)',
                'Design (cars, planes)',
                'Repair (cars, various mechanisms)',
                'Basic knowledge support (safety considerations, etc.)'
            ],
            specialtyLabel: 'Special Skills',
            specialtyList: [
                'Integration of RC and AI',
                'Information gathering on latest models',
                'Fine details like mechanism compatibility'
            ],
            philosophyLabel: 'Activity Philosophy',
            philosophyValue: 'Passing on technology to the next generation through the fusion of AI technology and RC culture',
            achievementsTitle: '📊 Activity History',
            achievement1Number: '100+',
            achievement1Label: 'Land RC Repairs',
            achievement1Sublabel: 'Models repaired',
            achievement2Number: '30+',
            achievement2Label: 'Mechanism Repairs',
            achievement2Sublabel: 'Cases',
            achievement3Number: '20+',
            achievement3Label: 'Air RC Repairs',
            achievement3Sublabel: 'Cases',
            achievement4Number: '18 Years',
            achievement4Label: 'RC Experience',
            achievement4Sublabel: 'Extensive',
            achievement5Number: '2 Years',
            achievement5Label: 'Support Activity',
            achievement5Sublabel: 'Ongoing',
            achievement6Number: '20+',
            achievement6Label: 'Manufacturers',
            achievement6Sublabel: 'Diverse experience',
            makersTitle: '🔧 Compatible Manufacturers (Partial)',
            makersNote: '※Feel free to inquire about manufacturers not listed'
        },
        snsSection: {
            title: 'SNS & Channels',
            youtubeTitle: 'YouTube Channel',
            youtubeDescription: 'RC building and flight videos',
            youtubeNote: '(Owned and operated by me)',
            youtubeBannerGuide: '↑↑Click or tap the banner above to visit the channel↑↑',
            xTitle: 'X (formerly Twitter)',
            xDescription: 'Daily RC activity records and latest updates',
            xBannerGuide: '↑↑Click or tap the banner above to visit X↑↑'
        },
        activitySection: {
            title: 'Activity Log',
            blogTitle: '📖 Technical Blog (note)',
            blogDescription: 'Sharing detailed information including repair processes, parts reviews, and technical notes that cannot be fully conveyed through SNS.',
            noteTitle: 'note',
            noteDescription: 'Detailed records of repair processes and technical explanations',
            latestArticlesTitle: '📌 Latest Blog Articles',
            moreArticles: 'View More Articles →'
        },
        goodsSection: {
            title: 'Goods',
            comingSoon: '🚧 Coming Soon 🚧',
            description: 'We plan to offer original goods and information-packed PDF files in the future.',
            notice: '※This site does not handle product sales or order acceptance. We will use external services for distribution.'
        },
        supportSection: {
            title: 'RC Support & Assistance',
            mainTitle: 'Support for RC Beginners',
            support1Icon: '✏️',
            support1Title: 'Support for Beginners',
            support1Description: 'We work together to create plans gently and carefully, even for those touching RC for the first time.',
            support2Icon: '🔧',
            support2Title: 'About Repair & Maintenance',
            support2Description: 'We perform basic maintenance and repairs together. For advanced repairs, please contact us through the inquiry form. While some things may be impossible, we will honestly explain the reasons.',
            support2Detail: 'For extremely expensive RC repairs or special cases where parts are unavailable, we may refer you to nearby repair shops for resolution. (If parts are already available or can be purchased, I can repair them.)',
            support2Example: '※Example of expensive RC repair: RC plane crash → mechanical trouble inspection + detection of fine cracks + wood procurement + film/paint repair + time-consuming drying process + final check and finishing, etc.',
            support2ExampleNote: '(Please inquire for details.)',
            support3Icon: '🎓',
            support3Title: 'Improving Piloting Skills',
            support3Description: 'I am still learning, so I cannot perform all operations. However, I have some understanding of Tamiya Grand Prix, F3A, and F3C. (Please be forgiving of piloting skills.)',
            support3Detail: 'We strive to bring smiles by finding optimal practice methods suited to each person, comparing desired products with existing RC equipment for improvement practice or optimizing purchase order, utilizing AI.',
            conversationExample: '※I like both RC planes and RC cars, but both are halfway. How should I allocate time to each?',
            conversationAnswer: '→ X% to ○○, X% to ○○. It may change depending on your mindset, but the likely satisfying approach would be ○○ state! So now, you may not need ○○, but rather the mindset of ○○ might be important. Let\'s practice slowly over time! If you can achieve this much in ○○ weeks, buying ○○ might also be an option (*´ω｀)',
            support3DetailEnd: 'We approach each person individually in this manner. (If we were unable to help or were overly intrusive, we sincerely apologize. Please always feel free to share your honest thoughts, which we take seriously.)',
            note: 'Please contact us for details'
        },
        testimonialsSection: {
            title: 'Testimonials from Supported Users',
            intro: 'Testimonials from those who have received support. We appreciate their cooperation in creating this website.',
            testimonial1Name: 'Testimonial from Mr. Y',
            testimonial1Tag: 'Teens・Beginner・Land RC (Buggy)',
            testimonial1Text: 'Personally, I liked older buggies. However, older models have many parts issues, so I wasn\'t sure if starting was good. But by securing both new and old parts, both are now my beloved cars for practice. I learned difficult ESC settings by changing locations and learning operation from PC, and can now do it myself. Always running together and teaching tips - I\'m truly grateful.',
            testimonial2Name: 'Testimonial from Mr. O',
            testimonial2Tag: '50s・Returning Hobbyist・Land & Air RC',
            testimonial2Text: 'With a sudden walk-in repair, we found the cause was initial defect from the store, and immediately got a new replacement from the store. Since then, despite being like Rip Van Winkle with RC after a long time, I was taught current RC knowledge as much as possible. Though struggling, I managed to learn. Now continuing consultations to fly planes as the next step. Using LINE gives faster responses than email, leading to quick solutions. I\'d love to fly together next time. Very grateful.',
            testimonial3Name: 'Testimonial from Mr. K',
            testimonial3Tag: '60s・Experienced・Air RC (Planes, Helicopters)',
            testimonial3Text: 'Even with experience, keeping up with information is difficult, and sometimes I don\'t know how to set things up. However, looking at manuals together, optimal settings matching my level were provided. Repeatedly adjusting immediately after landing and taking off, I quickly understood what I couldn\'t do before. Thanks to this, though my main was planes, helicopters are also fun - I\'m hooked. Still can only hover, but discovering new things at this age is precious. Thank you.',
            testimonial4Name: 'Testimonial from Mr. A',
            testimonial4Tag: '30s・2 Years Drone Experience・Air RC (Helicopter)',
            testimonial4Text: 'Though I\'d flown drones, RC helicopter difficulty is exceptional. Initially even takeoff was difficult and scary. Thank you for teaching everything from 1 to 10 thoroughly. I thought growth would take much longer, but understanding mechanisms while flying led to increasing stability. I can now hover and turn. Though I don\'t yet have difficult skills like Postsoni-san, I\'m so hooked I might catch up and surpass you lol. Let\'s enjoy RC together while drinking warm tea and discussing RC!',
            testimonial5Name: 'Testimonial from Mr. S',
            testimonial5Tag: '30s・Beginner・Land RC',
            testimonial5Text: 'Initially I said buggy only and entering competitions. However, I was too focused on that feeling, forgetting childlike enthusiasm. Of course speed is fun, but I didn\'t know current models have such durable options even when thrashing around. Of course, improving my maintenance skills is also a factor lol. Now occasionally running fast buggies while getting maintenance help, and customizing off-road trucks durably on my own. That option existed?! I\'m surprised every time. Even though young, knowledge is too extensive, helping areas beyond my reach. Thank you always.'
        },
        faqSection: {
            title: 'FAQ',
            intro: 'We\'ve compiled frequently asked questions. If you have concerns, please check here first.',
            q1: 'I\'m a complete beginner, is that okay?',
            a1: 'Of course! No problem even if you know nothing!',
            q2: 'How much does it cost to start RC?',
            a2: 'Based on your inquiry, we think together about estimated costs for starting RC. While you make purchases yourself, we help determine "about this much?" standards and select items appropriate for your level. With the motto of "expanding enjoyment," we support starting without strain!',
            q3: 'Where do you operate? What areas do you cover?',
            a3: 'Primarily Sapporo. Online support also available as much as possible.',
            q4: 'What types of RC do you support?',
            a4: 'Cars, planes, helicopters, tanks, trucks, boats, toy-grade RC (targeting lower ages). Drones require consultation.',
            q5: 'How do you use AI?',
            a5: 'We utilize it for optimal vehicle selection and practice plan creation.',
            q6: 'How long do repairs take?',
            a6: 'Depends on the item, but often completed same day. For large items requiring part orders, it may take about a month. More complex processes require consultation.',
            q7: 'Can I consult online?',
            a7: 'Of course! Whether wanting to know details or just trying inquiry, please feel free to contact us.',
            q8: 'Can you handle old models?',
            a8: 'We handle them as much as possible. (Sometimes crafting parts if unavailable.) For example, we\'ve repaired the original Tamiya Hornet and some U-control parts.',
            q9: 'Can I work with you?',
            a9: 'More people creates more energy, so activities based on the same philosophy are possible!',
            q10: 'I\'m considering joining a club...',
            a10: 'We can introduce nearby clubs matching your level, or if nearby, introduce my own club. Our club has visitor fees for using courses and flying fields, so please feel free to ask questions.'
        },
        contactSection: {
            title: 'Contact',
            description1: 'Please contact us through the form below.',
            description2: 'Feel free to inquire about RC-related questions, repair requests, support consultations, etc.',
            notice: '※This form is for personal activity inquiries, not commercial purposes.',
            buttonText: '📧 Open Contact Form'
        },
        topSection: {
            title: 'Welcome to Postsoni Workshop',
            greetingTitle: 'About Postsoni',
            greeting: [
                'Hello, I am Postsoni. As of 2025, I am a 33-year-old male, and although I am still young, I am actively incorporating AI technology to spread the appeal and techniques of Radio Control (RC).',
                'Despite facing some physical and mental challenges, I do not let them stop me. Instead, I strive to overcome them through the new possibilities that AI offers.',
                'The world of RC is not just a "hobby" but a realm where machines and human senses intersect in reality. In today\'s society, where convenience can sometimes lead to loneliness, RC represents a warm culture where tangible technology and experience coexist.',
                'I want to be someone who passes on the charm of RC to the next generation. I believe that where modern technology and human passion meet, there is value worth preserving for future times.',
                'At "Postsoni Workshop," I share records of my own RC activities and trials. If you are interested, please take a look. There, you will find a mysterious world where nostalgia and the near future coexist.',
                'I will continue to communicate the original joy of RC and the "beauty of the fusion of people and technology" that lies within.'
            ],
            rcCollectionTitle: 'This is part of my RC collection',
            imageCaption1: 'Helicopter with mixed parts from repairs of JR PROPO E8, and EPP entry-level high-wing aircraft.',
            imageCaption2: 'INFERNO MP9 TKI3 base with nostalgic color paint.',
            imageCaption3: 'RC-Factory Super Extra L pre-assembly, video on YouTube.',
            galleryButtonText: 'View More Gallery',
            statsTitle: 'Activity Record at a Glance',
            stat1Number: '18 Years', stat1Label: 'RC Experience',
            stat2Number: '100+', stat2Label: 'RCs Repaired',
            stat3Number: '20+', stat3Label: 'Manufacturers',
            stat4Number: '2 Years', stat4Label: 'Support Activity',
            monthlyTitle: '📅 This Month',
            monthlyUpdated: 'Updated Oct 29, 2025',
            monthlyRepairsTitle: 'RCs Repaired',
            monthlyRepairsCount: '3 units',
            monthlySupportedTitle: 'People Supported',
            monthlySupportedCount: '3 people',
            monthlyNewModelTitle: 'New Model',
            monthlyNewModelDetail: 'RC-Factory Super Extra L build',
            monthlyNewsTitle: 'Latest Updates',
            monthlyNewsDetail: 'Heli-X simulator adjustments, RealFlight Evolution new aircraft introduction and model settings',
            ctaContact: 'Contact for Consultation'
        }
    },
    zh: {
        title: 'Postsoni工作室',
        subtitle: 'RC技术与热情的融合',
        nav: {
            top: '首页', news: '最新活动', gallery: '画廊',
            roadmap: '新手指南', profile: '简介', sns: '社交媒体',
            activity: '博客', goods: '商品', support: '支援',
            testimonials: '评价', faq: '常见问题', contact: '联系我们'
        },
        sidebar: {
            searchTitle: '站内搜索',
            searchPlaceholder: '搜索FAQ或博客文章',
            searchButton: '搜索',
            tocTitle: '目录'
        },
        newsSection: {
            title: '最新活动报告',
            comingSoon: '即将推出...',
            workInProgress: '我们正在翻译网站。请稍候。'
        },
        gallerySection: {
            title: '活动画廊',
            caption1: '确认了平成初期陆地OS发动机经过拆解清洁维护后可重新启动。',
            caption2: '这个变速齿轮已磨损',
            caption3: '更换变速齿轮,行驶检查后完成变速时机设定',
            caption4: '过去视频中直升机坠落瞬间的截图（我坠落的机体是JR的E8。现在看来已经相当老旧，零件也很少。）',
            caption5: '与现在销售的直升机混合使用，使其处于可飞行状态。详情请参阅YouTube的飞行视频。',
            caption6: '对K110S进行拆解清洁维护，确认桅杆轴在不可见程度上偏移。维修中的照片。',
            caption7: '下一代趣味飞行机的制作。制作说明书不是日语，即使是较难的图纸也在制作中。（桐木机也可以同样制作。）',
            badgeBefore: '维修前',
            badgeAfter: '维修后',
            badgeCompleted: '维修完成',
            badgeCrashed: '刚坠落'
        },
        roadmapSection: {
            title: '开始RC的5个步骤',
            intro: '为想要开始或回归RC的人提供的可靠步骤指南。我们将按照您的节奏提供支持。',
            step1Title: '💬 咨询',
            step1Item1: 'RC初期费用咨询！',
            step1Item2: '一收到联系就争取当天决定！（如需考虑当然可以慢慢来。）',
            step1Item3: '我们会具体了解您感兴趣的RC类型，并一起讨论需要什么。',
            step2Title: '🎯 选择RC类型',
            step2Item1: '为您选择的类型提供平均初期费用概算，同时继续咨询。',
            step2Item2: '这里也争取当天决定！（如需考虑，我们会配合您的节奏。）',
            step2Item3: '区分新手或回归者，根据水平一起选择合适的RC型号。',
            step3Title: '🤝 购买后支持',
            step3Item1: '根据您选择的RC内容一起讨论可行驶、飞行的场所。（事前讨论也可以。）',
            step3Item2: '一起寻找附近的俱乐部。（对于还不想加入俱乐部的人，我们会继续提供场所建议。）',
            step3Item3: '根据现行法律选择合适的场所。',
            step3Item4: '如果在附近，我们可以根据每个人的情况决定场所并约定见面，一起观看行驶或飞行以确保不会害怕。（如果在远方，我们会询问第一次玩时发生了什么困难，并支持改善。）',
            step4Title: '🔧 基本维护',
            step4Item1: '根据您喜欢的RC，按预算一起讨论维护所需物品。（结合我的经验和AI，客观地选择合适的物品。当然也可以事前讨论。）',
            step4Item2: '传授维护基础知识，支持您自己也能操作RC。',
            step5Title: '🚀 进入RC世界',
            step5Item1: '完成STEP1～4的人应该已经可以独自游玩了。即使是回归者，也应该能跟上当前的RC知识。',
            step5Item2: '如果在附近，遇到困难时请随时联系。即使在远方，我们也会尽快回应。',
            step5Item3: 'RC的初期阶段到此结束！可以按自己的节奏玩，也可以大量练习，欢迎进入RC世界！',
            note: '※这是一个指南。我们会根据每个人的游玩方式需求真诚地应对。请随时通过联系表单与我们联系。'
        },
        profileSection: {
            title: '简介',
            nameLabel: '姓名',
            nameValue: 'Postsoni',
            ageLabel: '年龄',
            ageValue: '33岁（截至2025年）',
            expertiseLabel: '专业领域',
            expertiseList: [
                '遥控操作（汽车、飞机、直升机）',
                '设计（汽车、飞机）',
                '维修（汽车、各种机械）',
                '基础知识支持（安全考虑等）'
            ],
            specialtyLabel: '特长',
            specialtyList: [
                'RC与AI的融合',
                '最新机型等信息收集',
                '机械兼容性等细节'
            ],
            philosophyLabel: '活动理念',
            philosophyValue: '通过AI技术与RC文化的融合，向下一代传承技术',
            achievementsTitle: '📊 活动历史',
            achievement1Number: '100+',
            achievement1Label: '陆地RC维修',
            achievement1Sublabel: '修好的型号',
            achievement2Number: '30+',
            achievement2Label: '机械维修',
            achievement2Sublabel: '件',
            achievement3Number: '20+',
            achievement3Label: '空中RC维修',
            achievement3Sublabel: '件',
            achievement4Number: '18年',
            achievement4Label: 'RC经验',
            achievement4Sublabel: '丰富经验',
            achievement5Number: '2年',
            achievement5Label: '支持活动',
            achievement5Sublabel: '持续进行中',
            achievement6Number: '20+',
            achievement6Label: '制造商',
            achievement6Sublabel: '多样经验',
            makersTitle: '🔧 支持的制造商（部分）',
            makersNote: '※未列出的制造商也请随时咨询'
        },
        snsSection: {
            title: '社交媒体和频道',
            youtubeTitle: 'YouTube 频道',
            youtubeDescription: '发布RC制作和飞行视频',
            youtubeNote: '（由我拥有和运营）',
            youtubeBannerGuide: '↑↑点击或点按上方横幅访问频道↑↑',
            xTitle: 'X（原Twitter）',
            xDescription: '发布RC活动的日常记录和最新信息',
            xBannerGuide: '↑↑点击或点按上方横幅访问X↑↑'
        },
        activitySection: {
            title: '活动记录',
            blogTitle: '📖 技术博客（note）',
            blogDescription: '发布维修过程、零件评测、技术备忘录等SNS无法完全传达的详细信息。',
            noteTitle: 'note',
            noteDescription: '详细记录维修过程和技术解说',
            latestArticlesTitle: '📌 最新博客文章',
            moreArticles: '查看更多文章 →'
        },
        goodsSection: {
            title: '商品',
            comingSoon: '🚧 准备中 🚧',
            description: '计划今后推出原创商品和信息丰富的PDF文件等。',
            notice: '※本网站不处理商品销售或订单受理。将使用其他外部服务进行销售。'
        },
        supportSection: {
            title: 'RC支援与支持',
            mainTitle: '对RC初学者的支持',
            support1Icon: '✏️',
            support1Title: '对初学者的支援',
            support1Description: '即使是第一次接触遥控的人，我们也会温柔细致地一起摸索计划。',
            support2Icon: '🔧',
            support2Title: '关于维修保养',
            support2Description: '一起进行基础维护和维修。关于高级维修，请通过联系表单联系。虽然有些确实无法做到，但我们会诚实地说明理由。',
            support2Detail: '对于维修费用过高的遥控或零件另需且无法获得的特殊情况，我们可能会介绍附近的维修店以寻求解决。（如果零件已有或可以购买，我也可以维修。）',
            support2Example: '※维修费用高的遥控一例：遥控飞机坠落→机械故障检查+发现细微裂纹+木材采购+修复薄膜和涂装+等待干燥的耗时工序+最终检查和完工等',
            support2ExampleNote: '（详情请咨询。）',
            support3Icon: '🎓',
            support3Title: '操纵技术提升',
            support3Description: '我也还是新手，并非所有操作都能做到。但是，关于Tamiya比赛、F3A、F3C还是有些了解的。（操纵技术请多包涵。）',
            support3Detail: '利用AI，为每个人找到最适合的练习方法，或者比较想要的商品和自己现有的遥控进行提升练习或优化购买顺序，努力让大家最后露出笑容。',
            conversationExample: '※我喜欢遥控飞机和遥控车，但两者都半途而废，应该如何分配各自的时间呢？',
            conversationAnswer: '→ ○○占几成、○○占几成，虽然根据自己的心境会有所变化，但大概令人满意的形式应该是○○状态！所以，现在需要的不是○○，实际上○○的思维方式可能更重要，所以花时间慢慢练习吧！如果○○周后能做到这个程度，那么购买○○也是一个选择(*´ω｀)',
            support3DetailEnd: '就是这样的形式，面对每一个人。（如果没能帮上忙或过度干涉，非常抱歉。随时都可以说出来，我会认真对待真心话。）',
            note: '详情请咨询'
        },
        testimonialsSection: {
            title: '接受支持者的声音',
            intro: '这是实际接受支持的人们的体验谈。感谢大家在网站开设时的协助。',
            testimonial1Name: 'Y先生的体验谈',
            testimonial1Tag: '10多岁・未经验・陆地RC（越野车）',
            testimonial1Text: '个人来说，我喜欢越野车中的老车型。但是，老车型存在很多零件问题，不知道是否适合开始。但是，通过确保新旧零件，现在两台都成为了练习用的爱车。在不同地方学习了从PC操作困难的ESC设置，自己也能做到了。总是一起跑，传授技巧，非常感谢。',
            testimonial2Name: 'O先生的体验谈',
            testimonial2Tag: '50多岁・回归者・陆地RC＆空中RC',
            testimonial2Text: '突然上门维修，发现原因是购买店的初期不良，马上从购买店换了新品。之后，尽管久违的遥控让我像浦岛太郎一样，还是尽力教给我现在的遥控知识，虽然很辛苦但还是学会了。现在为了下一步飞行飞机继续咨询，使用LINE等比邮件更快得到回复，解决得很快很高兴。下次飞行时希望能一起。非常感谢。',
            testimonial3Name: 'K先生的体验谈',
            testimonial3Tag: '60多岁・经验者・空中RC（飞机、直升机）',
            testimonial3Text: '即使有经验，跟上信息也很困难，有时不知道该如何设置。但是在旁边看说明书，给出了适合我水平的最佳设置，飞行后立即降落反复调整，我也能马上理解以前做不到的事情。托您的福，虽然主要是飞机，但直升机也很有趣，入迷了。虽然还只能悬停，但到了这个年纪还有新发现是很宝贵的。谢谢。',
            testimonial4Name: 'A先生的体验谈',
            testimonial4Tag: '30多岁・无人机经验2年・空中RC（直升机）',
            testimonial4Text: '虽然飞过无人机，但遥控直升机的难度是另一个级别。最初连起飞都很困难，害怕地做。从1到10全部细致地教我，非常感谢。原以为需要更长时间才能成长，但在理解机制的同时飞行，越来越稳定，悬停和转弯我也能做到。虽然还没有像Postsoni先生那样的高难度技能，但总有一天会追上并超越，完全入迷了笑，一定要一起喝着温暖的茶，聊遥控话题，一起享受遥控吧！',
            testimonial5Name: 'S先生的体验谈',
            testimonial5Tag: '30多岁・未经验・陆地RC',
            testimonial5Text: '最初说只选越野车要参加比赛。但是，我只顾着那份心情，忘记了童心的投入。当然速度也很有趣，但没想到现在的车型有这么耐造的型号。当然提升我的保养技能也是一个原因笑。现在偶尔跑快速越野车，一起做维护，也在自己进行越野卡车的坚固定制。没想到还有这招！每次都很惊讶。虽然年轻但知识太丰富，帮助我够不着的范围，总是感谢。'
        },
        faqSection: {
            title: '常见问题',
            intro: '我们整理了大家常问的问题。如有疑问，请先查看这里。',
            q1: '完全新手可以吗？',
            a1: '当然可以！什么都不懂也没问题！',
            q2: '开始玩遥控需要多少费用？',
            a2: '根据您的咨询内容，一起考虑开始遥控所需的费用预算。实际购物由您自己进行，但我们会帮助确定"大概这么多？"的标准，选择时会根据咨询者的水平为基础。以"扩展乐趣"为宗旨，支持无负担的开始！',
            q3: '在哪里活动？对应区域是？',
            a3: '基本是札幌。网络对应也尽可能进行。',
            q4: '对应什么样的遥控？',
            a4: '汽车、飞机、直升机、坦克、卡车、船、玩具遥控（指针对低年龄的遥控等）。无人机需要咨询。',
            q5: 'AI怎么使用？',
            a5: '用于最佳机体选择和练习计划制作。',
            q6: '维修需要多长时间？',
            a6: '因物品而异，但很多情况下当天完成。大型且需要订购零件的话，可能需要约1个月。工序越多越需要咨询。',
            q7: '可以在线咨询吗？',
            a7: '当然可以。想详细了解概要、试着咨询等，都欢迎。',
            q8: '老旧机体也能对应吗？',
            a8: '尽可能对应。（即使没有零件也可能自制。）例如，修理了田宫初代发售的Hornet，也修理了部分U-control。',
            q9: '可以一起活动吗？',
            a9: '人多了更有活力，所以也可以基于同样理念进行活动！',
            q10: '我在考虑加入俱乐部...',
            a10: '可以介绍符合自己水平的附近俱乐部，如果在附近也可以介绍我所属的俱乐部。我们俱乐部使用赛道和飞行场有访客费用，请随时提问。'
        },
        contactSection: {
            title: '联系我们',
            description1: '请通过以下表单联系。',
            description2: 'RC相关问题、维修委托、支持咨询等，请随时联系。',
            notice: '※本表单不用于商业目的，专用于个人活动咨询。',
            buttonText: '📧 打开联系表单'
        },
        topSection: {
            title: '欢迎来到Postsoni工作室',
            greetingTitle: 'Postsoni 问候',
            greeting: [
                '初次见面。我叫"Postsoni"。截至2025年，我是一名33岁的男性，虽然还很年轻，但我正在积极采用AI技术，希望传播遥控（以下简称RC）的魅力和技术。',
                '我虽然在身心上面临一些限制，但我不会因此停滞不前，而是通过AI这种新的可能性来克服它们。',
                'RC的世界不仅仅是一种"爱好"，而是机械与人的感知交汇的真实领域。在现代社会中，便利性的提升有时会让人感到孤独，而RC则是一种可以触摸到技术与体验共存的温暖文化。',
                '我希望成为将RC的魅力传递给下一代的人。我相信，在现代技术与人类热情交汇的地方，存在着值得留给未来时代的价值。',
                '在"Postsoni工作室"中，我分享了自己的RC活动记录和尝试的轨迹。如果您感兴趣，请务必来看看。那里有一个怀旧与未来共存的奇妙世界。',
                'RC所拥有的原始乐趣以及其中蕴含的"人与技术融合的美"，我将继续传播下去。'
            ],
            rcCollectionTitle: '这是我个人拥有的部分RC收藏',
            imageCaption1: '在修理JR PROPO E8过程中混合使用其他型号零件的直升机，以及EPP入门级高翼机。',
            imageCaption2: '以INFERNO MP9 TKI3为基础，改变车身涂装为怀旧色彩。',
            imageCaption3: 'RC-Factory Super Extra L的组装前照片，视频可在YouTube观看。',
            galleryButtonText: '查看更多画廊',
            statsTitle: '一目了然的活动记录',
            stat1Number: '18年', stat1Label: 'RC经验',
            stat2Number: '100+', stat2Label: '修好的RC',
            stat3Number: '20社+', stat3Label: '支持的制造商',
            stat4Number: '2年', stat4Label: '支持活动',
            monthlyTitle: '📅 本月活动',
            monthlyUpdated: '2025年10月29日更新',
            monthlyRepairsTitle: '维修的RC',
            monthlyRepairsCount: '3台',
            monthlySupportedTitle: '支持的人数',
            monthlySupportedCount: '3名',
            monthlyNewModelTitle: '新机型',
            monthlyNewModelDetail: 'RC-Factory Super Extra L的制作',
            monthlyNewsTitle: '最新更新',
            monthlyNewsDetail: 'Heli-X模拟器调整、RealFlight Evolution新机体导入和模型设定',
            ctaContact: '点击此处咨询'
        }
    }
};

// ===== 多言語切り替え機能 =====
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'ja';
    setLanguage(currentLang);
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) btn.classList.add('active');
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setLanguage(lang);
            localStorage.setItem('language', lang);
        });
    });
}

function setLanguage(lang) {
    const trans = translations[lang];
    if (!trans) return;
    
    // タイトルとサブタイトル
    const mainTitle = document.querySelector('.main-title');
    const subtitle = document.querySelector('.subtitle');
    if (mainTitle) mainTitle.textContent = trans.title;
    if (subtitle) subtitle.textContent = trans.subtitle;
    
    // ナビゲーション
    Object.keys(trans.nav).forEach(key => {
        const navItem = document.querySelector(`[data-tab="${key}"]`);
        if (navItem) {
            const icon = navItem.textContent.split(' ')[0];
            navItem.textContent = icon + ' ' + trans.nav[key];
        }
    });
    
    // サイドバー - サイト内検索
    const searchTitle = document.querySelector('.search-title');
    const searchInput = document.getElementById('siteSearch');
    const searchBtn = document.getElementById('searchBtn');
    if (searchTitle) searchTitle.textContent = '🔍 ' + trans.sidebar.searchTitle;
    if (searchInput) searchInput.placeholder = trans.sidebar.searchPlaceholder;
    if (searchBtn) searchBtn.textContent = trans.sidebar.searchButton;
    
    // サイドバー - 目次タイトル
    const tocTitle = document.querySelector('.nav-title');
    if (tocTitle) tocTitle.textContent = '📌 ' + trans.sidebar.tocTitle;
    
    // 最新の活動報告セクション
    const newsTitle = document.querySelector('#news .section-title');
    const newsComingSoon = document.querySelector('#news .coming-soon-title');
    const newsText = document.querySelector('#news .coming-soon-text');
    if (newsTitle) newsTitle.textContent = '📰 ' + trans.newsSection.title;
    if (newsComingSoon) newsComingSoon.textContent = trans.newsSection.comingSoon;
    if (newsText) newsText.textContent = trans.newsSection.workInProgress;
    
    // 活動ギャラリーセクション
    const galleryTitle = document.querySelector('#gallery .section-title');
    if (galleryTitle) galleryTitle.textContent = '📸 ' + trans.gallerySection.title;
    
    // 活動ギャラリー - 画像キャプション
    const galleryCaptions = document.querySelectorAll('#gallery .gallery-caption');
    if (galleryCaptions[0]) galleryCaptions[0].textContent = trans.gallerySection.caption1;
    if (galleryCaptions[1]) galleryCaptions[1].textContent = trans.gallerySection.caption2;
    if (galleryCaptions[2]) galleryCaptions[2].textContent = trans.gallerySection.caption3;
    if (galleryCaptions[3]) galleryCaptions[3].textContent = trans.gallerySection.caption4;
    if (galleryCaptions[4]) galleryCaptions[4].textContent = trans.gallerySection.caption5;
    if (galleryCaptions[5]) galleryCaptions[5].textContent = trans.gallerySection.caption6;
    if (galleryCaptions[6]) galleryCaptions[6].textContent = trans.gallerySection.caption7;
    
    // 活動ギャラリー - バッジ
    const galleryBadges = document.querySelectorAll('#gallery .related-badge');
    galleryBadges.forEach(badge => {
        const text = badge.textContent.trim();
        if (text === '修理前' || text === 'Before Repair' || text === '维修前') badge.textContent = trans.gallerySection.badgeBefore;
        else if (text === '修理後' || text === 'After Repair' || text === '维修后') badge.textContent = trans.gallerySection.badgeAfter;
        else if (text === '修理完了' || text === 'Repair Complete' || text === '维修完成') badge.textContent = trans.gallerySection.badgeCompleted;
        else if (text === '墜落直後' || text === 'Just Crashed' || text === '刚坠落') badge.textContent = trans.gallerySection.badgeCrashed;
    });
    
    // TOPセクション - タイトル
    const topTitle = document.querySelector('#top .section-title');
    if (topTitle) topTitle.textContent = '🏠 ' + trans.topSection.title;
    
    // TOPセクション - 挨拶タイトル
    const greetingTitle = document.querySelector('.greeting-title');
    if (greetingTitle) greetingTitle.textContent = trans.topSection.greetingTitle;
    
    // TOPセクション - 挨拶文（6段落）
    const greetingPs = document.querySelectorAll('.greeting-content p');
    if (trans.topSection.greeting && greetingPs.length >= 6) {
        trans.topSection.greeting.forEach((text, index) => {
            if (greetingPs[index]) greetingPs[index].textContent = text;
        });
    }
    
    // 最終段落（closing）
    const greetingClosing = document.querySelector('.greeting-closing');
    if (greetingClosing && trans.topSection.greeting[5]) {
        greetingClosing.textContent = trans.topSection.greeting[5];
    }
    
    // TOPセクション - RCコレクションタイトル
    const visualIntro = document.querySelector('.visual-intro');
    if (visualIntro) visualIntro.textContent = trans.topSection.rcCollectionTitle;
    
    // TOPセクション - 画像キャプション
    const visualCaptions = document.querySelectorAll('.visual-caption');
    if (visualCaptions[0]) visualCaptions[0].textContent = trans.topSection.imageCaption1;
    if (visualCaptions[1]) visualCaptions[1].textContent = trans.topSection.imageCaption2;
    if (visualCaptions[2]) visualCaptions[2].textContent = trans.topSection.imageCaption3;
    
    // TOPセクション - ギャラリーボタン
    const galleryBtn = document.querySelector('.gallery-link-button');
    if (galleryBtn) galleryBtn.textContent = trans.topSection.galleryButtonText + ' →';
    
    // TOPセクション - 統計タイトル
    const statsTitle = document.querySelector('.stats-title');
    if (statsTitle) statsTitle.textContent = trans.topSection.statsTitle;
    
    // TOPセクション - 統計数値とラベル
    const statNumbers = document.querySelectorAll('.stat-number');
    const statLabels = document.querySelectorAll('.stat-label');
    if (statNumbers[0]) statNumbers[0].textContent = trans.topSection.stat1Number;
    if (statLabels[0]) statLabels[0].innerHTML = trans.topSection.stat1Label;
    if (statNumbers[1]) statNumbers[1].textContent = trans.topSection.stat2Number;
    if (statLabels[1]) statLabels[1].innerHTML = trans.topSection.stat2Label;
    if (statNumbers[2]) statNumbers[2].textContent = trans.topSection.stat3Number;
    if (statLabels[2]) statLabels[2].innerHTML = trans.topSection.stat3Label;
    if (statNumbers[3]) statNumbers[3].textContent = trans.topSection.stat4Number;
    if (statLabels[3]) statLabels[3].innerHTML = trans.topSection.stat4Label;
    
    // TOPセクション - 今月の活動
    const reportTitle = document.querySelector('.report-title');
    const reportDate = document.querySelector('.report-date');
    if (reportTitle) reportTitle.textContent = trans.topSection.monthlyTitle;
    if (reportDate) reportDate.textContent = trans.topSection.monthlyUpdated;
    
    // TOPセクション - 今月の活動項目
    const reportTitles = document.querySelectorAll('.report-content h4');
    if (reportTitles[0]) reportTitles[0].textContent = trans.topSection.monthlyRepairsTitle;
    if (reportTitles[1]) reportTitles[1].textContent = trans.topSection.monthlySupportedTitle;
    if (reportTitles[2]) reportTitles[2].textContent = trans.topSection.monthlyNewModelTitle;
    if (reportTitles[3]) reportTitles[3].textContent = trans.topSection.monthlyNewsTitle;
    
    // TOPセクション - 今月の活動数値と詳細
    const reportNumbers = document.querySelectorAll('.report-number');
    const reportDetails = document.querySelectorAll('.report-detail');
    if (reportNumbers[0]) reportNumbers[0].textContent = trans.topSection.monthlyRepairsCount;
    if (reportNumbers[1]) reportNumbers[1].textContent = trans.topSection.monthlySupportedCount;
    if (reportDetails[0]) reportDetails[0].textContent = trans.topSection.monthlyNewModelDetail;
    if (reportDetails[1]) reportDetails[1].textContent = trans.topSection.monthlyNewsDetail;
    
    // TOPセクション - CTAボタン
    const ctaBtn = document.querySelector('.cta-primary');
    if (ctaBtn) ctaBtn.textContent = '👉 ' + trans.topSection.ctaContact;
    
    // 初めての方へセクション
    const roadmapTitle = document.querySelector('#roadmap .section-title');
    const roadmapIntro = document.querySelector('#roadmap .roadmap-intro');
    if (roadmapTitle) roadmapTitle.textContent = '🛤️ ' + trans.roadmapSection.title;
    if (roadmapIntro) roadmapIntro.textContent = trans.roadmapSection.intro;
    
    // 初めての方へ - STEP 1-5のタイトル
    const stepTitles = document.querySelectorAll('#roadmap .step-title');
    if (stepTitles[0]) stepTitles[0].textContent = trans.roadmapSection.step1Title;
    if (stepTitles[1]) stepTitles[1].textContent = trans.roadmapSection.step2Title;
    if (stepTitles[2]) stepTitles[2].textContent = trans.roadmapSection.step3Title;
    if (stepTitles[3]) stepTitles[3].textContent = trans.roadmapSection.step4Title;
    if (stepTitles[4]) stepTitles[4].textContent = trans.roadmapSection.step5Title;
    
    // 初めての方へ - STEP 1のリスト項目（3項目）
    const step1Items = document.querySelectorAll('#roadmap .roadmap-step:nth-child(2) .step-list li');
    if (step1Items[0]) step1Items[0].textContent = trans.roadmapSection.step1Item1;
    if (step1Items[1]) step1Items[1].textContent = trans.roadmapSection.step1Item2;
    if (step1Items[2]) step1Items[2].textContent = trans.roadmapSection.step1Item3;
    
    // 初めての方へ - STEP 2のリスト項目（3項目）
    const step2Items = document.querySelectorAll('#roadmap .roadmap-step:nth-child(3) .step-list li');
    if (step2Items[0]) step2Items[0].textContent = trans.roadmapSection.step2Item1;
    if (step2Items[1]) step2Items[1].textContent = trans.roadmapSection.step2Item2;
    if (step2Items[2]) step2Items[2].textContent = trans.roadmapSection.step2Item3;
    
    // 初めての方へ - STEP 3のリスト項目（4項目）
    const step3Items = document.querySelectorAll('#roadmap .roadmap-step:nth-child(4) .step-list li');
    if (step3Items[0]) step3Items[0].textContent = trans.roadmapSection.step3Item1;
    if (step3Items[1]) step3Items[1].textContent = trans.roadmapSection.step3Item2;
    if (step3Items[2]) step3Items[2].textContent = trans.roadmapSection.step3Item3;
    if (step3Items[3]) step3Items[3].textContent = trans.roadmapSection.step3Item4;
    
    // 初めての方へ - STEP 4のリスト項目（2項目）
    const step4Items = document.querySelectorAll('#roadmap .roadmap-step:nth-child(5) .step-list li');
    if (step4Items[0]) step4Items[0].textContent = trans.roadmapSection.step4Item1;
    if (step4Items[1]) step4Items[1].textContent = trans.roadmapSection.step4Item2;
    
    // 初めての方へ - STEP 5のリスト項目（3項目）
    const step5Items = document.querySelectorAll('#roadmap .roadmap-step:nth-child(6) .step-list li');
    if (step5Items[0]) step5Items[0].textContent = trans.roadmapSection.step5Item1;
    if (step5Items[1]) step5Items[1].textContent = trans.roadmapSection.step5Item2;
    if (step5Items[2]) step5Items[2].textContent = trans.roadmapSection.step5Item3;
    
    // 初めての方へ - 注記
    const roadmapNote = document.querySelector('#roadmap .roadmap-note');
    if (roadmapNote) roadmapNote.textContent = trans.roadmapSection.note;
    
    // プロフィールセクション - タイトル
    const profileTitle = document.querySelector('#profile .section-title');
    if (profileTitle) profileTitle.textContent = '👤 ' + trans.profileSection.title;
    
    // プロフィールセクション - プロフィール項目
    const profileLabels = document.querySelectorAll('#profile .profile-label');
    const profileValues = document.querySelectorAll('#profile .profile-value');
    
    // 名前
    if (profileLabels[0]) profileLabels[0].textContent = trans.profileSection.nameLabel;
    if (profileValues[0]) profileValues[0].textContent = trans.profileSection.nameValue;
    
    // 年齢
    if (profileLabels[1]) profileLabels[1].textContent = trans.profileSection.ageLabel;
    if (profileValues[1]) profileValues[1].textContent = trans.profileSection.ageValue;
    
    // 専門分野
    if (profileLabels[2]) profileLabels[2].textContent = trans.profileSection.expertiseLabel;
    const expertiseList = document.querySelectorAll('#profile .profile-item:nth-child(3) .profile-list ul li');
    trans.profileSection.expertiseList.forEach((text, index) => {
        if (expertiseList[index]) expertiseList[index].textContent = text;
    });
    
    // 特技
    if (profileLabels[3]) profileLabels[3].textContent = trans.profileSection.specialtyLabel;
    const specialtyList = document.querySelectorAll('#profile .profile-item:nth-child(4) .profile-list ul li');
    trans.profileSection.specialtyList.forEach((text, index) => {
        if (specialtyList[index]) specialtyList[index].textContent = text;
    });
    
    // 活動理念
    if (profileLabels[4]) profileLabels[4].textContent = trans.profileSection.philosophyLabel;
    if (profileValues[4]) profileValues[4].textContent = trans.profileSection.philosophyValue;
    
    // 今までの活動
    const achievementsTitle = document.querySelector('.achievements-title');
    if (achievementsTitle) achievementsTitle.textContent = trans.profileSection.achievementsTitle;
    
    // 統計数値
    const achievementNumbers = document.querySelectorAll('.achievement-number');
    const achievementLabels = document.querySelectorAll('.achievement-label');
    const achievementSublabels = document.querySelectorAll('.achievement-sublabel');
    
    if (achievementNumbers[0]) achievementNumbers[0].textContent = trans.profileSection.achievement1Number;
    if (achievementLabels[0]) achievementLabels[0].textContent = trans.profileSection.achievement1Label;
    if (achievementSublabels[0]) achievementSublabels[0].textContent = trans.profileSection.achievement1Sublabel;
    
    if (achievementNumbers[1]) achievementNumbers[1].textContent = trans.profileSection.achievement2Number;
    if (achievementLabels[1]) achievementLabels[1].textContent = trans.profileSection.achievement2Label;
    if (achievementSublabels[1]) achievementSublabels[1].textContent = trans.profileSection.achievement2Sublabel;
    
    if (achievementNumbers[2]) achievementNumbers[2].textContent = trans.profileSection.achievement3Number;
    if (achievementLabels[2]) achievementLabels[2].textContent = trans.profileSection.achievement3Label;
    if (achievementSublabels[2]) achievementSublabels[2].textContent = trans.profileSection.achievement3Sublabel;
    
    if (achievementNumbers[3]) achievementNumbers[3].textContent = trans.profileSection.achievement4Number;
    if (achievementLabels[3]) achievementLabels[3].textContent = trans.profileSection.achievement4Label;
    if (achievementSublabels[3]) achievementSublabels[3].textContent = trans.profileSection.achievement4Sublabel;
    
    if (achievementNumbers[4]) achievementNumbers[4].textContent = trans.profileSection.achievement5Number;
    if (achievementLabels[4]) achievementLabels[4].textContent = trans.profileSection.achievement5Label;
    if (achievementSublabels[4]) achievementSublabels[4].textContent = trans.profileSection.achievement5Sublabel;
    
    if (achievementNumbers[5]) achievementNumbers[5].textContent = trans.profileSection.achievement6Number;
    if (achievementLabels[5]) achievementLabels[5].textContent = trans.profileSection.achievement6Label;
    if (achievementSublabels[5]) achievementSublabels[5].textContent = trans.profileSection.achievement6Sublabel;
    
    // 対応可能メーカー
    const makersTitle = document.querySelector('.makers-title');
    const makersNote = document.querySelector('.makers-note');
    if (makersTitle) makersTitle.textContent = trans.profileSection.makersTitle;
    if (makersNote) makersNote.textContent = trans.profileSection.makersNote;
    
    // SNSセクション - タイトル
    const snsTitle = document.querySelector('#sns .section-title');
    if (snsTitle) snsTitle.textContent = '📱 ' + trans.snsSection.title;
    
    // SNSセクション - YouTube
    const youtubeTitle = document.querySelector('#sns .sns-item.youtube h3');
    const youtubeDescription = document.querySelector('#sns .sns-item.youtube p:first-of-type');
    const youtubeNote = document.querySelector('#sns .sns-item.youtube .sns-note');
    const youtubeBannerGuide = document.querySelector('#sns .sns-item.youtube .banner-guide');
    
    if (youtubeTitle) youtubeTitle.textContent = trans.snsSection.youtubeTitle;
    if (youtubeDescription) youtubeDescription.textContent = trans.snsSection.youtubeDescription;
    if (youtubeNote) youtubeNote.textContent = trans.snsSection.youtubeNote;
    if (youtubeBannerGuide) youtubeBannerGuide.textContent = trans.snsSection.youtubeBannerGuide;
    
    // SNSセクション - X（旧Twitter）
    const xTitle = document.querySelector('#sns .sns-item.x-item h3');
    const xDescription = document.querySelector('#sns .sns-item.x-item p');
    const xBannerGuide = document.querySelector('#sns .banner-guide-small');
    
    if (xTitle) xTitle.textContent = trans.snsSection.xTitle;
    if (xDescription) xDescription.textContent = trans.snsSection.xDescription;
    if (xBannerGuide) xBannerGuide.textContent = trans.snsSection.xBannerGuide;
    
    // 活動記録セクション - タイトル
    const activityTitle = document.querySelector('#activity .section-title');
    if (activityTitle) activityTitle.textContent = '📝 ' + trans.activitySection.title;
    
    // 活動記録セクション - ブログ
    const blogTitle = document.querySelector('#activity .blog-title');
    const blogDescription = document.querySelector('#activity .blog-description');
    const noteTitle = document.querySelector('#activity .note-link-box h4');
    const noteDescription = document.querySelector('#activity .note-link-box p');
    const latestArticlesTitle = document.querySelector('#activity .note-embed-title');
    const moreArticles = document.querySelector('#activity .note-more-link a');
    
    if (blogTitle) blogTitle.textContent = trans.activitySection.blogTitle;
    if (blogDescription) blogDescription.textContent = trans.activitySection.blogDescription;
    if (noteTitle) noteTitle.textContent = trans.activitySection.noteTitle;
    if (noteDescription) noteDescription.textContent = trans.activitySection.noteDescription;
    if (latestArticlesTitle) latestArticlesTitle.textContent = trans.activitySection.latestArticlesTitle;
    if (moreArticles) moreArticles.textContent = trans.activitySection.moreArticles;
    
    // グッズセクション - タイトル
    const goodsTitle = document.querySelector('#goods .section-title');
    if (goodsTitle) goodsTitle.textContent = '🛍️ ' + trans.goodsSection.title;
    
    // グッズセクション - コンテンツ
    const goodsComingSoon = document.querySelector('#goods .coming-soon');
    const goodsDescription = document.querySelectorAll('#goods .goods-card p')[1];
    const goodsNotice = document.querySelector('#goods .goods-notice');
    
    if (goodsComingSoon) goodsComingSoon.textContent = trans.goodsSection.comingSoon;
    if (goodsDescription) goodsDescription.textContent = trans.goodsSection.description;
    if (goodsNotice) goodsNotice.textContent = trans.goodsSection.notice;
    
    // RC支援・サポートセクション - タイトル
    const supportTitle = document.querySelector('#support .section-title');
    if (supportTitle) supportTitle.textContent = '🤝 ' + trans.supportSection.title;
    
    // RC支援・サポートセクション - メインタイトル
    const supportMainTitle = document.querySelector('#support .support-card h3');
    if (supportMainTitle) supportMainTitle.textContent = trans.supportSection.mainTitle;
    
    // RC支援・サポートセクション - サポート項目
    const supportItems = document.querySelectorAll('#support .support-item');
    
    // サポート1
    if (supportItems[0]) {
        const title1 = supportItems[0].querySelector('h4');
        const desc1 = supportItems[0].querySelector('p');
        if (title1) title1.textContent = trans.supportSection.support1Title;
        if (desc1) desc1.textContent = trans.supportSection.support1Description;
    }
    
    // サポート2
    if (supportItems[1]) {
        const title2 = supportItems[1].querySelector('h4');
        const paragraphs2 = supportItems[1].querySelectorAll('p');
        if (title2) title2.textContent = trans.supportSection.support2Title;
        if (paragraphs2[0]) paragraphs2[0].textContent = trans.supportSection.support2Description;
        if (paragraphs2[1]) paragraphs2[1].textContent = trans.supportSection.support2Detail;
        if (paragraphs2[2]) {
            paragraphs2[2].innerHTML = trans.supportSection.support2Example + '<br>' + trans.supportSection.support2ExampleNote;
        }
    }
    
    // サポート3
    if (supportItems[2]) {
        const title3 = supportItems[2].querySelector('h4');
        const desc3 = supportItems[2].querySelectorAll('p:not(.conversation-example):not(.conversation-answer)');
        const conversation3 = supportItems[2].querySelectorAll('.conversation-example, .conversation-answer');
        
        if (title3) title3.textContent = trans.supportSection.support3Title;
        if (desc3[0]) desc3[0].textContent = trans.supportSection.support3Description;
        if (desc3[1]) desc3[1].textContent = trans.supportSection.support3Detail;
        if (conversation3[0]) conversation3[0].textContent = trans.supportSection.conversationExample;
        if (conversation3[1]) conversation3[1].textContent = trans.supportSection.conversationAnswer;
        if (desc3[2]) desc3[2].textContent = trans.supportSection.support3DetailEnd;
    }
    
    // RC支援・サポートセクション - 注記
    const supportNote = document.querySelector('#support .support-note');
    if (supportNote) supportNote.textContent = trans.supportSection.note;
    
    // サポートを受けた方の声セクション - タイトル
    const testimonialsTitle = document.querySelector('#testimonials .section-title');
    if (testimonialsTitle) testimonialsTitle.textContent = '🎉 ' + trans.testimonialsSection.title;
    
    // サポートを受けた方の声セクション - イントロ
    const testimonialsIntro = document.querySelector('#testimonials .testimonials-intro');
    if (testimonialsIntro) testimonialsIntro.textContent = trans.testimonialsSection.intro;
    
    // サポートを受けた方の声セクション - 各体験談
    const testimonialItems = document.querySelectorAll('#testimonials .testimonial-item');
    
    // 体験談1
    if (testimonialItems[0]) {
        const name1 = testimonialItems[0].querySelector('.testimonial-name');
        const tag1 = testimonialItems[0].querySelector('.testimonial-tag');
        const text1 = testimonialItems[0].querySelector('.testimonial-content p');
        if (name1) name1.textContent = trans.testimonialsSection.testimonial1Name;
        if (tag1) tag1.textContent = trans.testimonialsSection.testimonial1Tag;
        if (text1) text1.textContent = trans.testimonialsSection.testimonial1Text;
    }
    
    // 体験談2
    if (testimonialItems[1]) {
        const name2 = testimonialItems[1].querySelector('.testimonial-name');
        const tag2 = testimonialItems[1].querySelector('.testimonial-tag');
        const text2 = testimonialItems[1].querySelector('.testimonial-content p');
        if (name2) name2.textContent = trans.testimonialsSection.testimonial2Name;
        if (tag2) tag2.textContent = trans.testimonialsSection.testimonial2Tag;
        if (text2) text2.textContent = trans.testimonialsSection.testimonial2Text;
    }
    
    // 体験談3
    if (testimonialItems[2]) {
        const name3 = testimonialItems[2].querySelector('.testimonial-name');
        const tag3 = testimonialItems[2].querySelector('.testimonial-tag');
        const text3 = testimonialItems[2].querySelector('.testimonial-content p');
        if (name3) name3.textContent = trans.testimonialsSection.testimonial3Name;
        if (tag3) tag3.textContent = trans.testimonialsSection.testimonial3Tag;
        if (text3) text3.textContent = trans.testimonialsSection.testimonial3Text;
    }
    
    // 体験談4
    if (testimonialItems[3]) {
        const name4 = testimonialItems[3].querySelector('.testimonial-name');
        const tag4 = testimonialItems[3].querySelector('.testimonial-tag');
        const text4 = testimonialItems[3].querySelector('.testimonial-content p');
        if (name4) name4.textContent = trans.testimonialsSection.testimonial4Name;
        if (tag4) tag4.textContent = trans.testimonialsSection.testimonial4Tag;
        if (text4) text4.textContent = trans.testimonialsSection.testimonial4Text;
    }
    
    // 体験談5
    if (testimonialItems[4]) {
        const name5 = testimonialItems[4].querySelector('.testimonial-name');
        const tag5 = testimonialItems[4].querySelector('.testimonial-tag');
        const text5 = testimonialItems[4].querySelector('.testimonial-content p');
        if (name5) name5.textContent = trans.testimonialsSection.testimonial5Name;
        if (tag5) tag5.textContent = trans.testimonialsSection.testimonial5Tag;
        if (text5) text5.textContent = trans.testimonialsSection.testimonial5Text;
    }
    
    // FAQセクション - タイトル
    const faqTitle = document.querySelector('#faq .section-title');
    if (faqTitle) faqTitle.textContent = '❓ ' + trans.faqSection.title;
    
    // FAQセクション - イントロ
    const faqIntro = document.querySelector('#faq .faq-intro');
    if (faqIntro) faqIntro.textContent = trans.faqSection.intro;
    
    // FAQセクション - 質問と回答
    const faqItems = document.querySelectorAll('#faq .faq-item');
    
    // Q1
    if (faqItems[0]) {
        const q1 = faqItems[0].querySelector('.faq-question h3');
        const a1 = faqItems[0].querySelector('.faq-answer p');
        if (q1) q1.textContent = trans.faqSection.q1;
        if (a1) a1.textContent = trans.faqSection.a1;
    }
    
    // Q2
    if (faqItems[1]) {
        const q2 = faqItems[1].querySelector('.faq-question h3');
        const a2 = faqItems[1].querySelector('.faq-answer p');
        if (q2) q2.textContent = trans.faqSection.q2;
        if (a2) a2.textContent = trans.faqSection.a2;
    }
    
    // Q3
    if (faqItems[2]) {
        const q3 = faqItems[2].querySelector('.faq-question h3');
        const a3 = faqItems[2].querySelector('.faq-answer p');
        if (q3) q3.textContent = trans.faqSection.q3;
        if (a3) a3.textContent = trans.faqSection.a3;
    }
    
    // Q4
    if (faqItems[3]) {
        const q4 = faqItems[3].querySelector('.faq-question h3');
        const a4 = faqItems[3].querySelector('.faq-answer p');
        if (q4) q4.textContent = trans.faqSection.q4;
        if (a4) a4.textContent = trans.faqSection.a4;
    }
    
    // Q5
    if (faqItems[4]) {
        const q5 = faqItems[4].querySelector('.faq-question h3');
        const a5 = faqItems[4].querySelector('.faq-answer p');
        if (q5) q5.textContent = trans.faqSection.q5;
        if (a5) a5.textContent = trans.faqSection.a5;
    }
    
    // Q6
    if (faqItems[5]) {
        const q6 = faqItems[5].querySelector('.faq-question h3');
        const a6 = faqItems[5].querySelector('.faq-answer p');
        if (q6) q6.textContent = trans.faqSection.q6;
        if (a6) a6.textContent = trans.faqSection.a6;
    }
    
    // Q7
    if (faqItems[6]) {
        const q7 = faqItems[6].querySelector('.faq-question h3');
        const a7 = faqItems[6].querySelector('.faq-answer p');
        if (q7) q7.textContent = trans.faqSection.q7;
        if (a7) a7.textContent = trans.faqSection.a7;
    }
    
    // Q8
    if (faqItems[7]) {
        const q8 = faqItems[7].querySelector('.faq-question h3');
        const a8 = faqItems[7].querySelector('.faq-answer p');
        if (q8) q8.textContent = trans.faqSection.q8;
        if (a8) a8.textContent = trans.faqSection.a8;
    }
    
    // Q9
    if (faqItems[8]) {
        const q9 = faqItems[8].querySelector('.faq-question h3');
        const a9 = faqItems[8].querySelector('.faq-answer p');
        if (q9) q9.textContent = trans.faqSection.q9;
        if (a9) a9.textContent = trans.faqSection.a9;
    }
    
    // Q10
    if (faqItems[9]) {
        const q10 = faqItems[9].querySelector('.faq-question h3');
        const a10 = faqItems[9].querySelector('.faq-answer p');
        if (q10) q10.textContent = trans.faqSection.q10;
        if (a10) a10.textContent = trans.faqSection.a10;
    }
    
    // お問い合わせセクション - タイトル
    const contactTitle = document.querySelector('#contact .section-title');
    if (contactTitle) contactTitle.textContent = '✉️ ' + trans.contactSection.title;
    
    // お問い合わせセクション - 説明文
    const contactDescriptions = document.querySelectorAll('#contact .contact-description');
    if (contactDescriptions[0]) contactDescriptions[0].textContent = trans.contactSection.description1;
    if (contactDescriptions[1]) contactDescriptions[1].textContent = trans.contactSection.description2;
    
    // お問い合わせセクション - 注記とボタン
    const contactNotice = document.querySelector('#contact .contact-notice');
    const contactButton = document.querySelector('#contact .contact-button');
    if (contactNotice) contactNotice.textContent = trans.contactSection.notice;
    if (contactButton) contactButton.textContent = trans.contactSection.buttonText;
    
    // 訪問者カウンターのテキストを更新
    updateVisitorCounterText(lang);
}

// 訪問者カウンターのテキストを言語に応じて更新
function updateVisitorCounterText(lang) {
    const textElement = document.getElementById('visitorText');
    const countElement = document.getElementById('visitorCount');
    if (!textElement || !countElement) return;
    
    const count = countElement.textContent;
    if (count === '---' || count === '') return;
    
    if (lang === 'ja') {
        textElement.textContent = `あなたは${count}人目の訪問者です`;
    } else if (lang === 'en') {
        textElement.textContent = `You are visitor #${count}`;
    } else if (lang === 'zh') {
        textElement.textContent = `您是第${count}位访客`;
    }
}

function initPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker登録成功'))
            .catch(err => console.log('Service Worker登録失敗:', err));
    }
}

// ===== お問い合わせフォームを開く関数 =====
function openContactForm() {
    // 現在の言語を取得
    const currentLang = localStorage.getItem('language') || 'ja';
    // 言語パラメータ付きでcontact.htmlを開く
    window.open(`contact.html?lang=${currentLang}`, '_blank');
}

// グローバルに公開
window.openContactForm = openContactForm;

// ===== ページ読み込み時の初期化 =====
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initFAQ();
    initVisitorCounter();
    initBackToTop();
    initLoadingScreen();
    initDarkMode();
    initScrollAnimations();
    initVisitorStats();
    initSiteSearch();
    initLanguageSwitcher();
    initPWA();
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            updateBreadcrumbEnhanced(targetTab);
        });
    });
});