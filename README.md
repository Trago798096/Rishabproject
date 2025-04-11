# IPL Ticket Booking Website

एक पूरी तरह कार्यात्मक IPL टिकट बुकिंग वेबसाइट क्लोन - React और PostgreSQL डेटाबेस के साथ

## प्रोजेक्ट स्थापना

```bash
# डिपेंडेंसीज इंस्टॉल करें
npm install

# डेवलपमेंट सर्वर शुरू करें
npm run dev
```

## फीचर्स

- मैच देखने और टिकट बुकिंग करने के लिए यूजर इंटरफेस
- UPI के माध्यम से मैनुअल पेमेंट
- बुकिंग हिस्ट्री ट्रैकिंग
- मैचेस, टिकट और बुकिंग्स मैनेज करने के लिए एडमिन पैनल

## उपयोग के लिए URL

### यूजर पैनल
- होम पेज: `/`
- मैचेस: `/matches`
- एक विशेष मैच के लिए बुकिंग: `/matches/:id`
- बुकिंग सारांश: `/booking-summary/:ticketTypeId/:quantity`
- पेमेंट पेज: `/payment/:bookingId`
- बुकिंग कन्फर्मेशन: `/booking-confirmation/:bookingId`
- मेरी बुकिंग्स: `/my-bookings`

### एडमिन पैनल
- **एडमिन लॉगिन URL**: `/admin/login`
- एडमिन डैशबोर्ड: `/admin`
- मैच मैनेजमेंट: `/admin/matches`
- बुकिंग मैनेजमेंट: `/admin/bookings`
- पेमेंट सेटिंग्स: `/admin/payment-settings`

## एडमिन लॉगिन क्रेडेंशियल्स

- **यूजरनेम:** sanyamgulathi1@gmail.com
- **पासवर्ड:** 798096

## टेक्नोलॉजी स्टैक

- **फ्रंटएंड:** React, TailwindCSS, ShadCN UI, TanStack Query
- **बैकएंड:** Express, Node.js
- **डेटाबेस:** PostgreSQL
- **ORM:** Drizzle
- **अन्य:** Zod (वैलिडेशन), React Hook Form