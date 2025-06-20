/**
 * ملف script.js الكامل
 * يحتوي على جميع الدوال المطلوبة لتنزيل السيرة الذاتية كملف PDF
 */

// ==================== الدوال الرئيسية ====================

/**
 * تهيئة السنة في التذييل
 */
function initYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
        console.log('تم تحديث السنة بنجاح');
    }
}

/**
 * تهيئة التمرير السلس للروابط
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId !== '#') {
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 70,
                            behavior: 'smooth'
                        });
                        console.log(`التمرير إلى ${targetId} تم بنجاح`);
                    }
                } catch (error) {
                    console.error('حدث خطأ في التمرير السلس:', error);
                }
            }
        });
    });
}

/**
 * تغيير لون شريط التنقل عند التمرير
 */
function setupNavbarScrollEffect() {
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            const shouldChangeColor = window.scrollY > 100;
            navbar.style.backgroundColor = shouldChangeColor ? 'rgba(255,255,255,0.95)' : 'white';
            navbar.style.boxShadow = shouldChangeColor ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
        }
    });
    console.log('تم تهيئة تأثير شريط التنقل');
}

/**
 * تهيئة نموذج الاتصال
 */
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // يمكنك إضافة التحقق من صحة المدخلات هنا
            const formData = new FormData(contactForm);
            console.log('بيانات النموذج:', Object.fromEntries(formData));
            
            alert('شكراً لك! تم استلام رسالتك وسيتم الرد عليك قريباً.');
            this.reset();
        });
        console.log('تم تهيئة نموذج الاتصال');
    }
}

// ==================== دوال PDF الرئيسية ====================

/**
 * إنشاء وتنزيل ملف PDF
 */
async function generatePDF() {
    showLoadingIndicator('جاري إنشاء ملف PDF...');
    
    try {
        // التحقق من وجود المكتبة
        if (typeof html2pdf === 'undefined') {
            throw new Error('مكتبة html2pdf غير محملة');
        }

        // إنشاء عنصر مؤقت للتصدير
        const pdfContainer = createPDFContainer();
        
        // نسخ المحتوى المطلوب
        const content = await preparePDFContent();
        pdfContainer.appendChild(content);
        document.body.appendChild(pdfContainer);

        // خيارات PDF
        const options = getPDFOptions();
        
        // الانتظار لضمان تحميل كل العناصر
        await waitForAssetsToLoad(2000);
        
        // إنشاء وتنزيل PDF
        await html2pdf().set(options).from(pdfContainer).save();
        
        console.log('تم إنشاء PDF بنجاح');
    } catch (error) {
        console.error('فشل إنشاء PDF:', error);
        showErrorModal('حدث خطأ أثناء إنشاء الملف. الرجاء المحاولة لاحقاً أو استخدام بديل الطباعة.');
    } finally {
        cleanupAfterPDFGeneration();
    }
}

/**
 * تهيئة زر تحميل PDF
 */
function setupPDFDownload() {
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            await generatePDF();
        });
        console.log('تم تهيئة زر تحميل PDF');
    }
}

// ==================== دوال مساعدة لـ PDF ====================

/**
 * إنشاء عنصر مؤقت لتصدير PDF
 */
function createPDFContainer() {
    const container = document.createElement('div');
    container.className = 'pdf-temporary-container';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '794px'; // A4 width in pixels
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    container.style.boxSizing = 'border-box';
    return container;
}

/**
 * تحضير محتوى PDF
 */
async function preparePDFContent() {
    const contentWrapper = document.createElement('div');
    const sections = ['home', 'about', 'experience', 'education', 'skills', 'contact'];
    
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            const clone = section.cloneNode(true);
            
            // إزالة العناصر غير المرغوبة
            removeUnwantedElements(clone);
            
            // معالجة الصور
            processImagesForPDF(clone);
            
            contentWrapper.appendChild(clone);
        }
    });
    
    return contentWrapper;
}

/**
 * إزالة العناصر غير المرغوبة من نسخة PDF
 */
function removeUnwantedElements(element) {
    const selectorsToRemove = [
        'button', 
        'a', 
        'nav', 
        'footer', 
        '.no-export',
        '#download-pdf',
        '#print-fallback-btn'
    ];
    
    selectorsToRemove.forEach(selector => {
        element.querySelectorAll(selector).forEach(el => el.remove());
    });
}

/**
 * معالجة الصور لتناسب PDF
 */
function processImagesForPDF(element) {
    element.querySelectorAll('img').forEach(img => {
        if (!img.src.startsWith('data:') && !img.src.includes(window.location.hostname)) {
            const altDiv = document.createElement('div');
            altDiv.className = 'image-placeholder';
            altDiv.textContent = img.alt || '[صورة]';
            altDiv.style.border = '1px dashed #999';
            altDiv.style.padding = '10px';
            altDiv.style.textAlign = 'center';
            altDiv.style.margin = '10px 0';
            img.parentNode.replaceChild(altDiv, img);
        }
    });
}

/**
 * الحصول على خيارات PDF
 */
function getPDFOptions() {
    return {
        filename: `السيرة_الذاتية_${new Date().toLocaleDateString('ar-EG')}.pdf`,
        margin: 15,
        image: { 
            type: 'jpeg', 
            quality: 0.98 
        },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: false,
            scrollX: 0,
            scrollY: 0,
            width: 794,
            windowWidth: 794,
            logging: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };
}

/**
 * الانتظار لتحميل العناصر
 */
function waitForAssetsToLoad(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * التنظيف بعد إنشاء PDF
 */
function cleanupAfterPDFGeneration() {
    const container = document.querySelector('.pdf-temporary-container');
    if (container) {
        container.remove();
    }
    hideLoadingIndicator();
}

// ==================== دوال واجهة المستخدم ====================

/**
 * عرض مؤشر التحميل
 */
function showLoadingIndicator(message = 'جاري المعالجة...') {
    const loader = document.createElement('div');
    loader.id = 'loading-indicator';
    loader.innerHTML = `
        <div class="loader-overlay">
            <div class="loader-spinner"></div>
            <p class="loader-message">${message}</p>
        </div>
        <style>
            .loader-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
                font-family: Arial, sans-serif;
            }
            .loader-spinner {
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            }
            .loader-message {
                margin: 0;
                font-size: 1.2rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loader);
}

/**
 * إخفاء مؤشر التحميل
 */
function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.remove();
    }
}

/**
 * عرض رسالة خطأ
 */
function showErrorModal(message) {
    const modal = document.createElement('div');
    modal.id = 'error-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <h3 class="modal-title">خطأ!</h3>
                <p class="modal-message">${message}</p>
                <button id="modal-close-btn" class="modal-button">حسناً</button>
            </div>
        </div>
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9998;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .modal-content {
                background: white;
                padding: 25px;
                border-radius: 8px;
                max-width: 80%;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .modal-title {
                color: #e74c3c;
                margin-top: 0;
            }
            .modal-message {
                margin-bottom: 20px;
                line-height: 1.5;
            }
            .modal-button {
                padding: 8px 20px;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
                transition: background 0.3s;
            }
            .modal-button:hover {
                background: #2980b9;
            }
        </style>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('modal-close-btn').addEventListener('click', function() {
        modal.remove();
    });
}

/**
 * تهيئة بديل الطباعة للطوارئ
 */
function setupPrintFallback() {
    const printBtn = document.createElement('button');
    printBtn.id = 'print-fallback-btn';
    printBtn.className = 'print-fallback-button';
    printBtn.textContent = 'النسخة البديلة للطباعة';
    
    printBtn.addEventListener('click', function() {
        openPrintView();
    });
    
    document.body.appendChild(printBtn);
    
    // إضافة تنسيقات CSS للزر
    const style = document.createElement('style');
    style.textContent = `
        .print-fallback-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #2c3e50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 1000;
            font-family: Arial, sans-serif;
            font-size: 0.9rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s;
        }
        .print-fallback-button:hover {
            background: #1a252f;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

/**
 * فتح نافذة الطباعة
 */
function openPrintView() {
    const printContent = getPrintContent();
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>السيرة الذاتية</title>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    direction: rtl;
                    line-height: 1.6;
                    color: #333;
                }
                @media print {
                    body {
                        padding: 15mm;
                        margin: 0;
                    }
                    .section {
                        page-break-after: avoid;
                        page-break-inside: avoid;
                    }
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            </style>
        </head>
        <body>${printContent}</body>
        </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

/**
 * تحضير محتوى الطباعة
 */
function getPrintContent() {
    const printWrapper = document.createElement('div');
    const sections = ['home', 'about', 'experience', 'education', 'skills', 'contact'];
    
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            const clone = section.cloneNode(true);
            clone.querySelectorAll('button, a, nav, footer').forEach(el => el.remove());
            printWrapper.appendChild(clone);
        }
    });
    
    return printWrapper.innerHTML;
}

// ==================== تهيئة التطبيق الرئيسية ====================

/**
 * تهيئة جميع وظائف التطبيق
 */
function initializeApp() {
    initYear();
    setupSmoothScrolling();
    setupNavbarScrollEffect();
    setupContactForm();
    setupPDFDownload();
    setupPrintFallback();
    
    console.log('تم تهيئة التطبيق بنجاح');
}

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeApp);
