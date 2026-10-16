import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  mr: {
    // Top Bar
    announcement: '✨ शुद्ध रेशीम व अस्सल टेस्टेड जरीची येवला पैठणी • 👑 १००% सिल्क मार्क प्रमाणित हातमाग • ⚡ संपूर्ण भारतात मोफत विमायुक्त डिलिव्हरी',
    
    // Brand
    brandName: 'PAITHANI VASTRAM',
    brandMarathi: 'पैठणी वस्त्रम',
    brandTagline: 'अस्सल हातमागाचा ऐतिहासिक राजवैभव • येवला व पैठण',
    
    // Nav & Actions
    searchPlaceholder: 'रंग, नक्षी शोधा (मोर बांगडी, पोपट मैना, असावली)...',
    adminPortal: 'प्रशासक दालन',
    savedSarees: 'जतन केलेल्या साड्या',
    cartBag: 'खरेदी पिशवी',
    langToggle: 'मराठी',
    
    // Categories
    catAll: '🌟 सर्व साड्या',
    catBridal: '👑 नवरी पैठणी (Bridal)',
    catPureSilk: '✨ शुद्ध रेशीम',
    catKadiyal: '🌿 कडियाल काठ',
    catBrocade: '🪡 ब्रोकेड पैठणी',
    catYeolaSpecial: '🏛️ येवला खास',

    // Hero
    heroBadge: 'येवला आणि पैठणचा ऐतिहासिक वारसा • पैठणी वस्त्रम',
    heroTitlePrefix: 'अस्सल हातमाग रेशमाची',
    heroTitleGold: 'वस्त्रराज्ञी पैठणी',
    heroDesc: 'पैठणी वस्त्रम मध्ये आपले सहर्ष स्वागत आहे! १००% शुद्ध मलबेरी रेशीम आणि टेस्टेड सोन्याच्या जरीने विणलेल्या अस्सल महाराष्ट्रीयन हातमाग साड्यांचा राजवैभव अनुभवा. पारंपारिक मोर-बांगडी, पोपट-मैना आणि असावली नक्षीचे अनमोल अलंकार.',
    heroExploreBtn: 'शाही संग्रह पहा ({count}+ साड्या)',
    heroHeritageBtn: '📜 २,००० वर्षांचा ऐतिहासिक वारसा',
    heroWeaverWhatsApp: 'विणकर व्हॉट्सॲप',
    
    // Stats
    stat1Title: 'सिल्क मार्क प्रमाणित',
    stat1Sub: '१००% अस्सल मलबेरी रेशीम',
    stat2Title: 'टेस्टेड खरी जरी',
    stat2Sub: 'पारंपारिक राजघराणी नक्षी',
    stat3Title: 'मोफत एक्सप्रेस डिलिव्हरी',
    stat3Sub: 'सुरक्षित विमायुक्त पाठवणी',
    stat4Title: '७ दिवसांची हमी',
    stat4Sub: 'सुलभ परतावा व अदलाबदल',

    // Catalog Header
    catalogBadge: 'हातमाग खजिना • अस्सल येवला हातमाग',
    catalogTitlePrefix: 'पैठणी वस्त्रम',
    catalogTitleGold: 'शाही संग्रह',
    catalogDesc: 'येवला आणि पैठणच्या कसबी विणकरांनी घडवलेल्या अस्सल हातमाग साड्या. प्रत्येकीत टेस्टेड गोल्ड जरी, शुद्ध मलबेरी रेशीम आणि पिढ्यानपिढ्या जतन केलेला अनमोल वारसा.',
    trustBadge1: '👑 १००% टेस्टेड गोल्ड जरी',
    trustBadge2: '🏛️ थेट येवला विणकरांकडून',

    // Filters Bar
    filterColor: 'रंग:',
    filterMotif: 'पदर नक्षी:',
    filterSort: 'क्रमवारी:',
    filterPersonalOnly: 'केवळ वैयक्तिक संग्रह',
    allMotifs: 'सर्व नक्षी',
    sortFeatured: 'विशेष साड्या (Featured)',
    sortPriceLow: 'किंमत: कमी ते जास्त',
    sortPriceHigh: 'किंमत: जास्त ते कमी',
    sortRating: 'उत्कृष्ट ग्राहक पसंती',
    showingCount: 'उपलब्ध',
    authenticSareesCount: 'अस्सल हातमाग साड्या',
    clearFilters: 'सर्व फिल्टर्स काढा',

    // Colors
    colAll: 'सर्व',
    colPink: 'गुलाबी',
    colGreen: 'हिरवा',
    colRed: 'लाल',
    colPurple: 'जांभळा',
    colBlue: 'निळा',
    colGold: 'सोनेरी',
    colOrange: 'केशरी',

    // Motifs
    motifMorBangadi: 'मोर बांगडी (Peacock in Ring)',
    motifPopatMaina: 'पोपट मैना (Parrots on Vine)',
    motifAsavali: 'असावली वेल (Flowering Vines)',

    // Empty State
    emptyTitle: 'तुमच्या निवडीनुसार साडी सापडली नाही',
    emptyDesc: 'कृपया सर्व साड्या पाहण्यासाठी फिल्टर किंवा शोध शब्द बदलून पहा.',
    emptyResetBtn: 'सर्व साड्या दाखवा',

    // Saree Card
    personalBadge: 'वैयक्तिक संग्रह',
    quickView: 'झटपट पहा व नक्षी',
    pureSilk: 'शुद्ध रेशीम',
    verifiedReviews: 'खात्रीशीर परीक्षणे',
    inclTaxes: 'सर्व कर समाविष्ट',
    addToBag: 'पिशवीत टाका',
    soldOut: 'विक्री पूर्ण (Sold Out)',
    onlyLeft: 'फक्त {count} शिल्लक',
    whatsappInquire: 'व्हॉट्सॲप विचारणा',

    // Saree Modal
    zoomHintZoom: '🔍 विणकाम जवळून पाहण्यासाठी क्लिक करा',
    zoomHintReset: '🔍 मूळ आकारात पहा',
    personalVerified: 'खात्रीशीर वैयक्तिक संग्रहातील अस्सल हातमाग साडी',
    silkMarkLabel: 'सिल्क मार्क प्रमाणित',
    customerReviewsCount: 'ग्राहक परीक्षणे',
    saveDiscount: 'सूट बचत',
    gstShippingFree: 'सर्व जीएसटी व मोफत विमायुक्त एक्सप्रेस डिलिव्हरी समाविष्ट',
    specFabric: 'पोत (रेशीम प्रकार)',
    specZari: 'जरीची गुणवत्ता',
    specPallu: 'पदर नक्षी',
    specBorder: 'काठ विणकाम',
    specOrigin: 'मूळ ठिकाण',
    specLength: 'साडी लांबी',
    specLengthVal: '६.३० मीटर (सिल्क ब्लाउज पीससह)',
    qtyLabel: 'नग संख्या:',
    instantBuy: '⚡ आताच खरेदी करा',
    requestVideoCall: '🎥 थेट व्हिडिओ कॉलवर साडी पाहण्यासाठी संपर्क करा',

    // Cart Drawer
    royalBagTitle: 'शाही खरेदी पिशवी',
    weavesCount: 'साड्या',
    emptyCartTitle: 'तुमची खरेदी पिशवी रिकामी आहे',
    emptyCartDesc: 'अस्सल हातमाग साडी निवडून शाही खरेदीचा अनुभव घ्या.',
    exploreCatalog: 'साड्यांचा संग्रह पहा',
    couponPlaceholder: 'कुपन कोड टाका (उदा. VASTRAM10)',
    applyBtn: 'लागू करा',
    subtotal: 'उप-एकूण रक्कम:',
    discount: 'सूट रक्कम:',
    finalTotal: 'अंतिम देय रक्कम:',
    proceedCheckout: 'ऑर्डर करण्यासाठी पुढे जा',

    // Wishlist Drawer & Bridal Trousseau (लग्नाचा बस्ता)
    wishlistTitle: 'लग्नाचा बस्ता (इच्छासूची)',
    bridalTrousseauBadge: '👑 लग्नाचा बस्ता • BRIDAL TROUSSEAU',
    trousseauSubtitle: 'विवाहासाठी निवडलेल्या अस्सल हातमाग पैठणी साड्यांचा शाही संग्रह',
    trousseauEstValue: 'बस्ता एकूण मूल्य:',
    trousseauShareHint: 'कुटुंब, सासरची मंडळी किंवा नातेवाईकांच्या पसंतीसाठी व्हॉट्सॲपवर पाठवा',
    shareBastaWhatsApp: '📲 व्हॉट्सॲपवर बस्ता शेअर करा',
    copyBastaLink: '📋 बस्ता लिंक कॉपी करा',
    linkCopiedToast: '✨ बस्ता लिंक कॉपी झाली! व्हॉट्सॲपवर कुटुंबासोबत शेअर करा.',
    moveAllToBag: '🛍️ सर्व साड्या पिशवीत जोडा',
    moveAllSuccess: 'सर्व साड्या खरेदी पिशवीत जोडल्या!',
    emptyWishlistTitle: 'लग्नाचा बस्ता अजून तयार नाही',
    emptyWishlistDesc: 'साडीवर दिलेल्या हार्ट (❤️) चिन्हावर क्लिक करून तुमच्या आवडीच्या अस्सल पैठणी साड्या बस्त्यात जोडा.',
    moveToBag: 'पिशवीत जोडा',
    sharedBastaViewing: '✨ तुम्ही शेअर केलेला लग्नाचा बस्ता पाहत आहात',
    sharedBastaViewingSub: 'कुटुंबाने विवाहासाठी निवडलेल्या पैठणी साड्यांची यादी',

    // Checkout Modal
    checkoutTitle: 'शाही ऑर्डर बुकिंग व विणकर पाठवणी',
    orderConfirmedTitle: 'ऑर्डर यशस्वीपणे नोंदवली!',
    customerInfo: 'ग्राहक माहिती व पत्ता',
    fullName: 'पूर्ण नाव',
    fullNamePlaceholder: 'उदा. सौ. अनिता कुलकर्णी',
    phone: 'मोबाईल नंबर (WhatsApp)',
    phonePlaceholder: '१० अंकी मोबाईल नंबर',
    email: 'ईमेल पत्ता (ऐच्छिक)',
    emailPlaceholder: 'तुमचा ईमेल',
    address: 'घर / फ्लॅट नं. व पत्ता',
    addressPlaceholder: 'संपूर्ण पत्ता जिथे साडी पाठवायची आहे',
    city: 'शहर / गाव',
    state: 'राज्य',
    pincode: 'पिन कोड',
    pincodePlaceholder: '६ अंकी पिन कोड',
    specialNotes: 'विशेष सूचना (उदा. लग्नाची तारीख)',
    paymentMethodTitle: 'पेमेंट पद्धत निवडा',
    paymentCod: 'कॅश ऑन डिलिव्हरी (Cash on Delivery)',
    paymentCodDesc: 'साडी हातात मिळाल्यावर पैसे द्या (१००% सुरक्षित)',
    paymentUpi: 'ऑनलाईन UPI / QR (Google Pay, PhonePe, Paytm)',
    paymentUpiDesc: 'थेट विणकरांच्या खात्यात सुरक्षित पेमेंट',
    placeOrderBtn: 'ऑर्डर निश्चित करा (Confirm Order)',
    orderSuccessMsg: 'अभिनंदन! तुमची शुद्ध रेशमी पैठणी साडीची ऑर्डर नोंदवली गेली आहे. आमचे विणकर प्रतिनिधी लवकरच आपल्याशी संपर्क साधतील.',
    sendWhatsAppBtn: '📱 व्हॉट्सॲपवर ऑर्डर खात्री पाठवा',

    // Heritage Section & Modal
    heritageBadge: 'वस्त्र राज्ञी • २,००० वर्षांचा सुवर्ण इतिहास',
    heritageTitlePrefix: 'येवला व पैठणचा',
    heritageTitleGold: 'अजरामर वारसा',
    heritageSubtitle: 'सातवाहन साम्राज्यापासून गोदावरीच्या तीरावर सुरू झालेली पैठणी ही भारतीय हातमाग रेशीम कलेचा सर्वोच्च मुकुटमणी मानली जाते.',
    readFullHistory: 'संपूर्ण २,००० वर्षांचा इतिहास वाचा',
    heritageModalTitle: 'पैठणीचा २,००० वर्षांचा सुवर्ण इतिहास',
    heritageModalSubtitle: 'सातवाहन, छत्रपती शिवराय आणि पेशवेकालीन महावस्त्र वैभव',

    // Motifs Detailed
    morBangadiTitle: 'मोर-बांगडी (Mor-Bangadi)',
    morBangadiSub: 'सोन्याच्या बांगडीत रुबाबदार मोर',
    morBangadiDesc: 'राजघराण्यांचे विशेष प्रतीक. सोन्याच्या बांगडीत किंवा कडीत विणलेला राजहंसासारखा मोर, जो अखंड सौभाग्य, समृद्धी आणि मांगल्याचे प्रतीक मानला जातो.',
    
    popatMainaTitle: 'पोपट-मैना (Popat-Maina)',
    popatMainaSub: 'फुललेल्या फांदीवर पोपट व मैना',
    popatMainaDesc: 'सह्याद्रीच्या निसर्गरम्य सृष्टीची प्रेरणा. फुललेल्या वृक्षांच्या फांदीवर बसलेली पोपट-मैना जोडी, जी वैवाहिक प्रेम, सुख आणि उल्हासाचे प्रतीक आहे.',
    
    asavaliTitle: 'आसावली वेल (Asavali)',
    asavaliSub: 'फुलदाणी व पवित्र मंगल कलश',
    asavaliDesc: 'पेशवेकाळात विशेष प्रसिद्ध पावलेली नक्षी. फुलांचे गुच्छ आणि मंगल कलशांची अप्रतिम वीण, जी ईश्वरीय कृपा आणि अभिजात सौंदर्याची साक्ष देते.',

    // Footer
    footerAbout: 'पिढ्यानपिढ्या चालत आलेला अस्सल महाराष्ट्रीयन हातमाग वारसा. प्रत्येक पैठणी १००% शुद्ध मलबेरी रेशीम आणि टेस्टेड सोन्याच्या जरीने पारंपारिक विणकर कुटुंबांकडून विणली जाते.',
    footerSilkMark: 'सिल्क मार्क ऑर्गनायझेशन ऑफ इंडिया नोंदणीकृत',
    footerRoyalWeaves: 'शाही साड्या',
    footerCareTitle: 'रेशीम साडी काळजी मार्गदर्शक',
    footerCare1: '✨ जरीची चमक टिकवण्यासाठी केवळ ड्राय क्लीन करा.',
    footerCare2: '✨ प्लास्टिकऐवजी शुद्ध सुती किंवा मलमल कापडात गुंडाळा.',
    footerCare3: '✨ जरीची घडी मोडू नये म्हणून वेळोवेळी घड्या बदला.',
    footerCare4: '✨ दर ६ महिन्यांनी सावलीत साडीला हवा दाखवा.',
    footerWorkshopTitle: 'येवला विणकर कार्यशाळा',
    footerWorkshopName: 'पैठणी वस्त्रम हेरिटेज विणकर',
    footerAddress: 'येवला, जि. नाशिक, महाराष्ट्र - ४२३४०१',
    footerHelpline: 'हेल्पलाईन: +९१ ७२१९१ २०९३५',
    footerCopyright: '© २०२६ पैठणी वस्त्रम. सर्व हक्क सुरक्षित. येवला व पैठण हातमाग विणकर संघटन.',
    footerAdminLink: '👑 विणकर व प्रशासक कक्ष'
  },
  en: {
    // Top Bar
    announcement: '✨ Pure Silk & Authentic Tested Zari Yeola Paithani • 👑 100% Handloom Silk Mark Certified • ⚡ Free Insured Express Delivery Across India',
    
    // Brand
    brandName: 'PAITHANI VASTRAM',
    brandMarathi: 'पैठणी वस्त्रम',
    brandTagline: 'THE ROYAL HERITAGE OF WEAVES • YEOLA & PAITHAN',
    
    // Nav & Actions
    searchPlaceholder: 'Search by color, motif (Mor, Popat, Asavali)...',
    adminPortal: 'Admin Portal',
    savedSarees: 'Saved Sarees',
    cartBag: 'Shopping Bag',
    langToggle: 'English',
    
    // Categories
    catAll: '🌟 All Sarees',
    catBridal: '👑 Bridal Paithani',
    catPureSilk: '✨ Pure Silk',
    catKadiyal: '🌿 Kadiyal Border',
    catBrocade: '🪡 Brocade Paithani',
    catYeolaSpecial: '🏛️ Yeola Special',

    // Hero
    heroBadge: 'HERITAGE WEAVING OF YEOLA & PAITHAN • PAITHANI VASTRAM',
    heroTitlePrefix: 'The Empress of',
    heroTitleGold: 'Handwoven Silks',
    heroDesc: 'Welcome to PAITHANI VASTRAM. Experience the supreme grandeur of authentic Maharashtrian handlooms — woven from 100% pure mulberry silk and tested gold zari, adorned with traditional Mor-Bangadi, Popat-Maina, and Asavali motifs.',
    heroExploreBtn: 'Explore Collection ({count}+ Weaves)',
    heroHeritageBtn: '📜 2,000-Yr Heritage Story',
    heroWeaverWhatsApp: 'Weaver WhatsApp',
    
    // Stats
    stat1Title: 'Silk Mark Certified',
    stat1Sub: '100% Genuine Mulberry Silk',
    stat2Title: 'Tested Gold Zari',
    stat2Sub: 'Rich Heirloom Motifs',
    stat3Title: 'Free Express Shipping',
    stat3Sub: 'Insured Worldwide Transit',
    stat4Title: '7-Day Guarantee',
    stat4Sub: 'Hassle-Free Easy Return',

    // Catalog Header
    catalogBadge: 'Handloom Treasury • अस्सल हातमाग',
    catalogTitlePrefix: 'The Paithani',
    catalogTitleGold: 'Vastram Collection',
    catalogDesc: 'Discover authentic Yeola & Paithan handlooms. Each masterpiece features tested zari, pure mulberry silk, and heirloom motifs passed through generations.',
    trustBadge1: '👑 100% Tested Gold Zari',
    trustBadge2: '🏛️ Direct From Yeola Weavers',

    // Filters Bar
    filterColor: 'Color:',
    filterMotif: 'Pallu Motif:',
    filterSort: 'Sort By:',
    filterPersonalOnly: 'Personal Collection Only',
    allMotifs: 'All Motifs',
    sortFeatured: 'Featured Weaves',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortRating: 'Top Customer Rated',
    showingCount: 'Showing',
    authenticSareesCount: 'authentic handloom sarees',
    clearFilters: 'Clear All Filters',

    // Colors
    colAll: 'All',
    colPink: 'Pink',
    colGreen: 'Green',
    colRed: 'Red',
    colPurple: 'Purple',
    colBlue: 'Blue',
    colGold: 'Gold',
    colOrange: 'Orange',

    // Motifs
    motifMorBangadi: 'Mor Bangadi (Peacock)',
    motifPopatMaina: 'Popat Maina (Parrot)',
    motifAsavali: 'Asavali (Flowering Vines)',

    // Empty State
    emptyTitle: 'No Sarees Found Matching Your Filters',
    emptyDesc: 'Try clearing filters or search term to view all handcrafted sarees.',
    emptyResetBtn: 'Show All Sarees',

    // Saree Card
    personalBadge: 'Personal Collection',
    quickView: 'Quick View & Motifs',
    pureSilk: 'Pure Silk',
    verifiedReviews: 'verified reviews',
    inclTaxes: 'incl. all taxes',
    addToBag: 'Add To Bag',
    soldOut: 'Sold Out',
    onlyLeft: 'Only {count} left',
    whatsappInquire: 'WhatsApp Inquire',

    // Saree Modal
    zoomHintZoom: '🔍 Click to Zoom Weave',
    zoomHintReset: '🔍 Click to Reset',
    personalVerified: 'Verified Personal Collection Handloom Piece',
    silkMarkLabel: 'Silk Mark Certified',
    customerReviewsCount: 'customer reviews',
    saveDiscount: 'SAVE',
    gstShippingFree: 'Inclusive of all GST & Insured Express Shipping',
    specFabric: 'Fabric',
    specZari: 'Zari Quality',
    specPallu: 'Pallu Motif',
    specBorder: 'Border Design',
    specOrigin: 'Origin',
    specLength: 'Saree Length',
    specLengthVal: '6.30 Meters (with Silk Blouse piece)',
    qtyLabel: 'Quantity:',
    instantBuy: '⚡ Instant Buy',
    requestVideoCall: '🎥 Connect on WhatsApp for Live Video Inspection',

    // Cart Drawer
    royalBagTitle: 'Royal Shopping Bag',
    weavesCount: 'weaves',
    emptyCartTitle: 'Your bag is empty',
    emptyCartDesc: 'Select an authentic handloom saree to experience royal grandeur.',
    exploreCatalog: 'Explore Collection',
    couponPlaceholder: 'Enter Coupon (e.g. VASTRAM10)',
    applyBtn: 'Apply',
    subtotal: 'Subtotal:',
    discount: 'Discount:',
    finalTotal: 'Final Total:',
    proceedCheckout: 'Proceed To Checkout',

    // Wishlist & Bridal Trousseau
    wishlistTitle: 'Bridal Trousseau (Wishlist)',
    bridalTrousseauBadge: '👑 BRIDAL TROUSSEAU • लग्नाचा बस्ता',
    trousseauSubtitle: 'Curated Authentic Yeola Handloom Sarees for Wedding & Celebrations',
    trousseauEstValue: 'Total Trousseau Value:',
    trousseauShareHint: 'Share your shortlisted wedding sarees directly with family on WhatsApp for approval',
    shareBastaWhatsApp: '📲 Share Trousseau on WhatsApp',
    copyBastaLink: '📋 Copy Trousseau Link',
    linkCopiedToast: '✨ Trousseau link copied to clipboard! Share with family on WhatsApp.',
    moveAllToBag: '🛍️ Move All Sarees to Bag',
    moveAllSuccess: 'All shortlisted sarees moved to your royal shopping bag!',
    emptyWishlistTitle: 'Your Bridal Trousseau is Empty',
    emptyWishlistDesc: 'Click the heart (❤️) icon on any saree in our catalog to curate your wedding basta.',
    moveToBag: 'Move to Bag',
    sharedBastaViewing: '✨ Viewing Shared Bridal Trousseau',
    sharedBastaViewingSub: 'Authentic handloom Paithani sarees curated and shortlisted for the wedding',

    // Checkout Modal
    checkoutTitle: 'Royal Checkout & Weaver Dispatch',
    orderConfirmedTitle: 'Order Confirmed!',
    customerInfo: 'Customer Shipping Details',
    fullName: 'Full Name',
    fullNamePlaceholder: 'e.g. Mrs. Anvita Kulkarni',
    phone: 'Mobile Number (WhatsApp)',
    phonePlaceholder: '10-digit mobile number',
    email: 'Email Address (Optional)',
    emailPlaceholder: 'Your email address',
    address: 'Delivery Address',
    addressPlaceholder: 'Flat / House No., Landmark, Street',
    city: 'City',
    state: 'State',
    pincode: 'Pincode',
    pincodePlaceholder: '6-digit pincode',
    specialNotes: 'Special Instructions (e.g. Wedding Date)',
    paymentMethodTitle: 'Select Payment Method',
    paymentCod: 'Cash On Delivery (COD)',
    paymentCodDesc: 'Pay upon hand delivery of your saree (100% Safe)',
    paymentUpi: 'Online UPI / QR Payment (GPay, PhonePe, Paytm)',
    paymentUpiDesc: 'Direct and verified payment to weaver accounts',
    placeOrderBtn: 'Confirm & Place Order',
    orderSuccessMsg: 'Congratulations! Your pure silk Paithani order has been placed. Our master weavers will personally contact you.',
    sendWhatsAppBtn: '📱 Send WhatsApp Confirmation',

    // Heritage Section & Modal
    heritageBadge: 'The Queen of Silks • वस्त्र राज्ञी',
    heritageTitlePrefix: 'The Living Heritage of',
    heritageTitleGold: 'Yeola & Paithan',
    heritageSubtitle: 'Dating back to the Satavahana dynasty over 2,000 years ago on the sacred banks of the Godavari river, Paithani is widely regarded as the ultimate pinnacle of Indian handloom silk weaving.',
    readFullHistory: 'Read 2,000-Yr Heritage Chronicles',
    heritageModalTitle: 'The Royal Heritage of Paithani Vastram',
    heritageModalSubtitle: 'From the Satavahana Empire to the Royal Court of the Peshwas',

    // Motifs Detailed
    morBangadiTitle: 'Mor-Bangadi (मोर बांगडी)',
    morBangadiSub: 'Royal Peacock within Golden Bangle',
    morBangadiDesc: 'The signature motif of royalty. A peacock woven gracefully within a round bangle or ring, representing royal protection, marital prosperity, and regal celebration.',
    
    popatMainaTitle: 'Popat-Maina (पोपट मैना)',
    popatMainaSub: 'Parrots on Blossoming Vine',
    popatMainaDesc: 'Inspired by the birds of the Western Ghats. Parrots perched upon flowering tree branches symbolizing sweet harmony, auspicious happiness, and joyous bridal celebrations.',
    
    asavaliTitle: 'Asavali (आसावली वेल)',
    asavaliSub: 'Flowering Vases & Kalash',
    asavaliDesc: 'An iconic weave patronized during the Peshwai era. Sacred flowering pots and kalash embodying spiritual blessings, divine wealth, and timeless handcrafted grandeur.',

    // Footer
    footerAbout: 'Honoring India\'s royal handloom traditions since generations. Every saree is meticulously handwoven with certified pure mulberry silk and authentic gold zari by traditional weaver families.',
    footerSilkMark: 'Silk Mark Organization of India Registered',
    footerRoyalWeaves: 'Royal Weaves',
    footerCareTitle: 'Silk Care Guide',
    footerCare1: '✨ Dry Clean only to preserve tested zari lustre.',
    footerCare2: '✨ Wrap in pure muslin / cotton cloth, not plastic.',
    footerCare3: '✨ Periodically change folds to prevent zari creasing.',
    footerCare4: '✨ Air the saree in shade every 6 months.',
    footerWorkshopTitle: 'Yeola Weaver Workshop',
    footerWorkshopName: 'Paithani Vastram Heritage Weavers',
    footerAddress: 'Yeola, Dist. Nashik, Maharashtra - 423401',
    footerHelpline: 'Helpline: +91 72191 20935',
    footerCopyright: '© 2026 PAITHANI VASTRAM. All Rights Reserved. Yeola & Paithan Handloom Collective.',
    footerAdminLink: '👑 Weaver & Admin Portal'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('pv_lang');
      return saved === 'en' ? 'en' : 'mr'; // Defaults to authentic Marathi
    } catch (e) {
      return 'mr';
    }
  });

  const setLanguage = (lang) => {
    const valid = lang === 'en' ? 'en' : 'mr';
    setLanguageState(valid);
    try {
      localStorage.setItem('pv_lang', valid);
      document.documentElement.lang = valid;
    } catch (e) {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'mr' ? 'en' : 'mr');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, fallback = '') => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  const getSareeName = (saree) => {
    if (!saree) return '';
    if (language === 'mr' && saree.marathiName) {
      return saree.marathiName;
    }
    return saree.name;
  };

  const getSareeSecondaryName = (saree) => {
    if (!saree) return '';
    if (language === 'mr') {
      return saree.name; // show English title as secondary reference
    }
    return saree.marathiName || '';
  };

  const getCategoryName = (cat) => {
    if (language !== 'mr') return cat;
    const catMap = {
      'All': '🌟 सर्व साड्या',
      'Bridal': '👑 नवरी पैठणी',
      'Pure Silk': '✨ शुद्ध रेशीम',
      'Kadiyal': '🌿 कडियाल',
      'Brocade': '🪡 ब्रोकेड पैठणी',
      'Yeola Special': '🏛️ येवला खास'
    };
    return catMap[cat] || cat;
  };

  const getColorName = (color) => {
    if (language !== 'mr') return color;
    const colorMap = {
      'All': 'सर्व रंग',
      'Pink': 'गुलाबी',
      'Green': 'हिरवा',
      'Red': 'लाल',
      'Purple': 'जांभळा',
      'Blue': 'निळा',
      'Gold': 'सोनेरी',
      'Orange': 'केशरी'
    };
    return colorMap[color] || color;
  };

  const getMotifName = (motif) => {
    if (language !== 'mr') return motif;
    const motifMap = {
      'All': 'सर्व नक्षी',
      'Mor Bangadi': 'मोर बांगडी',
      'Popat Maina': 'पोपट मैना',
      'Asavali': 'असावली'
    };
    return motifMap[motif] || motif;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isMarathi: language === 'mr',
        setLanguage,
        toggleLanguage,
        t,
        getSareeName,
        getSareeSecondaryName,
        getCategoryName,
        getColorName,
        getMotifName
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
