import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoice = (booking) => {
    // Initialize standard A4 PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Eastern Vacations Header & Branding
    doc.setFillColor(4, 25, 78); // Gulf Blue (#04194E)
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text('EASTERN VACATIONS', 14, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Tours and Safaris', 14, 32);

    // 2. Invoice Document Title & Meta
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text('CUSTOMER INVOICE', 14, 60);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: EV-${booking._id.substring(0, 8).toUpperCase()}`, 14, 70);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 14, 76);
    doc.text(`Status: ${booking.status === 'confirmed' ? 'CONFIRMED' : booking.status.toUpperCase()}`, 14, 82);

    // 3. Client Information Block
    doc.setFont("helvetica", "bold");
    doc.text('Billed To:', pageWidth - 80, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Client Name: ${booking.clientName}`, pageWidth - 80, 68);
    if (booking.clientEmail) doc.text(`Email: ${booking.clientEmail}`, pageWidth - 80, 74);
    if (booking.clientPhone) doc.text(`Phone: ${booking.clientPhone}`, pageWidth - 80, 80);

    // 4. Safari Booking Itinerary (AutoTable)
    doc.autoTable({
        startY: 100,
        head: [['Description', 'Itinerary Date', 'Pax', 'Vehicle/Transport']],
        body: [
            [
                `${booking.category.charAt(0).toUpperCase() + booking.category.slice(1)}: ${booking.route}`,
                new Date(booking.date).toLocaleDateString(),
                `${booking.pax || 1} Person(s)`,
                booking.vehicle && typeof booking.vehicle === 'object' ? booking.vehicle.plate : (booking.vehicle || 'TBD')
            ]
        ],
        headStyles: {
            fillColor: [227, 151, 106], // Di Serria Gold (#E3976A)
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            font: 'helvetica',
            halign: 'center',
            cellPadding: 6
        },
        columnStyles: {
            0: { halign: 'left' }
        }
    });

    // 5. Financial Breakdown
    const finalY = doc.lastAutoTable.finalY + 20;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount Due (Ksh):`, 120, finalY);

    // Attempt to extract numbers from price string if manual, otherwise format normally
    let formattedPrice = booking.price;
    if (typeof booking.price === 'number') {
        formattedPrice = booking.price.toLocaleString();
    }

    doc.setFontSize(14);
    doc.text(`KES ${formattedPrice}`, 170, finalY);

    // Note on payment
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    const paymentStatus = booking.paymentStatus === 'paid' ? 'PAID IN FULL - THANK YOU' : 'PAYMENT PENDING';
    doc.text(`Status: ${paymentStatus}`, 120, finalY + 10);

    // 6. Footer Information
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text('Eastern Vacations Tours and Safaris · PO Box 1234, Nairobi · bookings@easternvacations.com', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Thank you for choosing Eastern Vacations!', pageWidth / 2, footerY + 6, { align: 'center' });

    // Download the final PDF Document
    doc.save(`Invoice_EV-${booking.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
