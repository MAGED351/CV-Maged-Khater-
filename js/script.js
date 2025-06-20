// تنفيذ الشفرة بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحديث سنة حقوق النشر
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // تنعيم التمرير لروابط التنقل مع معالجة الأخطاء
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // التحقق من أن ال selector صالح
            if (targetId && targetId !== '#') {
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }
                } catch (error) {
                    console.error('Scroll Error:', error);
                }
            }
        });
    });

    // تغيير لون شريط التنقل عند التمرير
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.style.backgroundColor = window.scrollY > 100 ? 'rgba(255, 255, 255, 0.95)' : 'white';
            navbar.style.boxShadow = window.scrollY > 100 ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
        }
    });

    // إرسال نموذج الاتصال
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('شكراً لك! تم استلام رسالتك وسيتم الرد عليك قريباً.');
            this.reset();
        });
    }

    // دالة لتنزيل PDF مع معالجة مشكلة الصور (CORS)
    async function downloadPDF() {
        const downloadBtn = document.getElementById('download-pdf');
        if (!downloadBtn) return;

        downloadBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // عرض رسالة تحميل
            const loader = createLoader();
            document.body.appendChild(loader);
            
            try {
                // 1. إنشاء عنصر PDF جديد
                const pdfContainer = document.createElement('div');
                pdfContainer.className = 'pdf-container';
                pdfContainer.style.position = 'absolute';
                pdfContainer.style.left = '-9999px';
                
                // 2. نسخ المحتوى المطلوب
                const sections = ['home', 'about', 'experience', 'education', 'skills', 'contact'];
                sections.forEach(sectionId => {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        const clone = section.cloneNode(true);
                        
                        // إزالة العناصر غير المرغوبة
                        clone.querySelectorAll('button, a, nav, footer, .no-export').forEach(el => el.remove());
                        
                        // معالجة الصور لمنع مشكلة CORS
                        clone.querySelectorAll('img').forEach(img => {
                            img.crossOrigin = 'Anonymous';
                            img.onerror = function() {
                                this.style.display = 'none';
                            };
                        });
                        
                        pdfContainer.appendChild(clone);
                    }
                });
                
                document.body.appendChild(pdfContainer);
                
                // 3. خيارات PDF مع تعطيل canvas tainted
                const options = {
                    filename: `CV_${new Date().toISOString().slice(0, 10)}.pdf`,
                    margin: 10,
                    image: { 
                        type: 'jpeg', 
                        quality: 0.98 
                    },
                    html2canvas: { 
                        scale: 2,
                        useCORS: true,
                        allowTaint: false,
                        logging: false,
                        scrollX: 0,
                        scrollY: 0
                    },
                    jsPDF: { 
                        unit: 'mm', 
                        format: 'a4', 
                        orientation: 'portrait' 
                    }
                };
                
                // 4. التحويل مع تأخير لضمان تحميل الصور
                await new Promise(resolve => setTimeout(resolve, 1000));
                await html2pdf().set(options).from(pdfContainer).save();
                
            } catch (error) {
                console.error('PDF Generation Failed:', error);
                alert('حدث خطأ أثناء إنشاء الملف. الرجاء:\n1. التأكد من اتصال الإنترنت\n2. تجربة متصفح آخر\n3. استخدام صور من مصدر محلي');
            } finally {
                // التنظيف
                const pdfContainer = document.querySelector('.pdf-container');
                if (pdfContainer) pdfContainer.remove();
                if (loader) loader.remove();
            }
        });
    }

    // دالة لإنشاء رسالة تحميل
    function createLoader() {
        const loader = document.createElement('div');
        loader.innerHTML = `
            <div style="
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-family: Arial;
                flex-direction: column;
            ">
                <div style="
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #3498db;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <p>جاري تحضير ملف PDF...</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        return loader;
    }

    // بدء عملية تنزيل PDF
    downloadPDF();
});
