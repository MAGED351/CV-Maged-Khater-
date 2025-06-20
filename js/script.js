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
