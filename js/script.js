document.addEventListener('DOMContentLoaded', function() {
    // 1. التحقق من توفر المكتبات
    if (typeof html2pdf === 'undefined') {
        console.error('html2pdf غير محملة');
        alert('يوجد مشكلة في تحميل المكتبات المطلوبة. يرجى تحديث الصفحة.');
        return;
    }

    // 2. تهيئة العناصر الأساسية
    const yearElement = document.getElementById('year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // 3. دالة إنشاء PDF مع تحسينات للعمل على GitHub
    async function generatePDF() {
        try {
            // أ. إنشاء عنصر ظل للتصدير
            const pdfContainer = document.createElement('div');
            pdfContainer.className = 'pdf-export-container';
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            pdfContainer.style.width = '794px'; // A4 بالبكسل
            pdfContainer.style.padding = '20px';
            pdfContainer.style.backgroundColor = 'white';
            pdfContainer.style.boxSizing = 'border-box';
            
            // ب. نسخ المحتوى المطلوب
            const contentToCopy = document.body.cloneNode(true);
            
            // ج. إزالة العناصر غير المرغوبة (معدلة لتناسب GitHub)
            const elementsToRemove = [
                'navbar',
                'download-pdf',
                'footer',
                'contact-form',
                'social-links',
                'year'
            ];
            
            elementsToRemove.forEach(id => {
                const el = contentToCopy.getElementById(id);
                if (el) el.remove();
            });
            
            // د. معالجة خاصة للصور على GitHub
            contentToCopy.querySelectorAll('img').forEach(img => {
                if (!img.src.startsWith('data:')) {
                    // تحويل الصور إلى Base64 إذا لزم الأمر
                    if (!img.complete || img.naturalWidth === 0) {
                        const altDiv = document.createElement('div');
                        altDiv.textContent = img.alt || '[صورة]';
                        altDiv.style.border = '1px dashed #999';
                        altDiv.style.padding = '10px';
                        altDiv.style.textAlign = 'center';
                        img.parentNode.replaceChild(altDiv, img);
                    }
                }
            });
            
            pdfContainer.appendChild(contentToCopy);
            document.body.appendChild(pdfContainer);
            
            // هـ. خيارات PDF محسنة للعمل على GitHub
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
                    width: 794, // A4 width in pixels
                    windowWidth: 794,
                    logging: false
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                }
            };
            
            // و. إضافة تأخير إضافي للعمل على GitHub Pages
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // ز. التحويل النهائي
            await html2pdf().set(options).from(pdfContainer).save();
            
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('تعذر إنشاء الملف. الرجاء:\n1. التأكد من أن الصور محلية\n2. تجربة متصفح Chrome\n3. التحقق من اتصال الإنترنت');
        } finally {
            // ح. التنظيف
            const container = document.querySelector('.pdf-export-container');
            if (container) container.remove();
        }
    }

    // 4. ربط دالة PDF بالزر
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // عرض رسالة تحميل محسنة
            const loader = document.createElement('div');
            loader.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.9);
                    z-index: 9999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-family: Arial;
                    text-align: center;
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
                    <h3>جاري إنشاء ملف PDF</h3>
                    <p>قد يستغرق هذا بضع ثوانٍ...</p>
                    <p style="font-size:12px; margin-top:20px; color:#ccc">
                        إذا استمرت المشكلة، يرجى استخدام ميزة الطباعة في المتصفح (Ctrl+P)
                    </p>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
            document.body.appendChild(loader);
            
            await generatePDF();
            
            loader.remove();
        });
    }

    // 5. بديل الطباعة للطوارئ
    function setupPrintAlternative() {
        const printBtn = document.createElement('button');
        printBtn.id = 'print-alternative';
        printBtn.textContent = 'النسخة البديلة للطباعة';
        printBtn.style.position = 'fixed';
        printBtn.style.bottom = '20px';
        printBtn.style.right = '20px';
        printBtn.style.padding = '10px 15px';
        printBtn.style.background = '#2c3e50';
        printBtn.style.color = 'white';
        printBtn.style.border = 'none';
        printBtn.style.borderRadius = '4px';
        printBtn.style.cursor = 'pointer';
        printBtn.style.zIndex = '1000';
        printBtn.style.fontFamily = 'Arial';
        
        printBtn.addEventListener('click', function() {
            const printContent = document.querySelector('body').innerHTML;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>السيرة الذاتية</title>
                    <style>
                        body { font-family: Arial; padding: 20px; direction: rtl; }
                        @media print {
                            body { padding: 0; margin: 0; }
                            .section { page-break-after: avoid; }
                            img { max-width: 100% !important; }
                        }
                    </style>
                </head>
                <body>${printContent}</body>
                </html>
            `);
            
            setTimeout(() => {
                printWindow.print();
            }, 500);
        });
        
        document.body.appendChild(printBtn);
    }
    
    // تفعيل البديل عند الحاجة
    setupPrintAlternative();
});
