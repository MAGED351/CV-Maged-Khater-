document.addEventListener('DOMContentLoaded', function() {
    // 1. التحقق من توفر المكتبات
    if (typeof html2pdf === 'undefined') {
        alert('يوجد مشكلة في تحميل المكتبات المطلوبة');
        return;
    }

    // 2. دالة إنشاء PDF مؤكدة العمل
    async function generatePDF() {
        // أ. إنشاء عنصر مؤقت
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.width = '794px'; // A4 بالبكسل
        element.style.padding = '20px';
        
        // ب. نسخ المحتوى المهم فقط
        const sections = ['home', 'about', 'experience', 'education', 'skills', 'contact'];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                const clone = section.cloneNode(true);
                // إزالة أي أزرار أو عناصر غير مرغوبة
                clone.querySelectorAll('button, a, nav, footer').forEach(el => el.remove());
                element.appendChild(clone);
            }
        });
        
        document.body.appendChild(element);

        // ج. خيارات PDF بسيطة ومضمونة
        const opt = {
            filename: 'my-cv.pdf',
            margin: 10,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                scrollX: 0,
                scrollY: 0,
                width: 794
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            // انتظر ثانيتين لضمان تحميل كل شيء
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // أنشئ PDF
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ! جرب استخدام Chrome أو Edge');
        } finally {
            element.remove();
        }
    }

    // 3. ربط الزر بالدالة
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            generatePDF();
        });
    }
});








// =============== دوال تجميع المحتوى ===============

/**
 * تجميع كل أقسام السيرة الذاتية في عنصر واحد
 */
function gatherCVContent() {
    const cvContainer = document.createElement('div');
    cvContainer.className = 'cv-pdf-container';
    
    // إضافة تنسيقات CSS الخاصة بالPDF
    const styles = document.createElement('style');
    styles.textContent = `
        .cv-pdf-container {
            font-family: 'Arial', sans-serif;
            direction: rtl;
            width: 100%;
            padding: 20px;
            background: white;
            color: #333;
        }
        .cv-pdf-container h1 {
            color: #2c3e50;
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .cv-pdf-container h2 {
            color: #2980b9;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .cv-pdf-container .section {
            margin-bottom: 30px;
        }
    `;
    cvContainer.appendChild(styles);

    // الأقسام المطلوبة بالتسلسل الصحيح
    const sectionsOrder = ['home', 'about', 'experience', 'education', 'skills', 'contact'];
    
    sectionsOrder.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionClone = section.cloneNode(true);
            sectionClone.className = 'section';
            
            // تنظيف كل قسم قبل إضافته
            cleanSectionForPDF(sectionClone);
            
            cvContainer.appendChild(sectionClone);
        }
    });

    return cvContainer;
}

/**
 * تنظيف قسم معين لإدراجه في PDF
 */
function cleanSectionForPDF(section) {
    // إزالة العناصر غير المرغوبة
    const elementsToRemove = [
        'nav', 'footer', 'button', 
        '.no-export', '[onclick]',
        '.hero-buttons', '.social-links'
    ];
    
    elementsToRemove.forEach(selector => {
        section.querySelectorAll(selector).forEach(el => el.remove());
    });

    // معالجة الصور
    section.querySelectorAll('img').forEach(img => {
        if (!img.src.startsWith('data:') && !img.src.includes(window.location.hostname)) {
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = img.alt || '[صورة]';
            placeholder.style.cssText = `
                border: 1px dashed #999;
                padding: 10px;
                text-align: center;
                margin: 10px 0;
                background: #f9f9f9;
            `;
            img.replaceWith(placeholder);
        }
    });

    // تحسين التنسيقات
    section.querySelectorAll('*').forEach(el => {
        el.style.boxShadow = 'none';
        el.style.transition = 'none';
        el.style.animation = 'none';
    });
}

// =============== دالة إنشاء PDF معدلة ===============

async function generatePDF() {
    try {
        // 1. تجميع المحتوى
        const cvContent = gatherCVContent();
        document.body.appendChild(cvContent);
        
        // 2. خيارات PDF
        const options = {
            filename: 'السيرة_الذاتية.pdf',
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
                width: cvContent.scrollWidth,
                windowWidth: cvContent.scrollWidth
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            }
        };
        
        // 3. إضافة تأخير لضمان التحميل
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 4. إنشاء PDF
        await html2pdf().set(options).from(cvContent).save();
        
    } catch (error) {
        console.error('خطأ في إنشاء PDF:', error);
        showError('تعذر تجميع المحتوى. يرجى التحقق من أقسام السيرة الذاتية.');
    } finally {
        // 5. التنظيف
        const container = document.querySelector('.cv-pdf-container');
        if (container) container.remove();
    }
}

// =============== دوال مساعدة ===============

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #e74c3c;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 9999;
        max-width: 80%;
        text-align: center;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// =============== التهيئة الرئيسية ===============

document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            await generatePDF();
        });
    }
});
