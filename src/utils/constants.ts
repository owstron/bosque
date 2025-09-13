export const RESTAURANT_INFO = {
  name: 'Bosque',
  address: {
    street: '123 Valencia Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    full: '123 Valencia Street, San Francisco, CA 94103'
  },
  contact: {
    phone: '(415) 555-0123',
    email: 'hello@bosquesf.com'
  },
  hours: {
    'Tuesday - Thursday': '5:00 PM - 10:00 PM',
    'Friday - Saturday': '5:00 PM - 11:00 PM',
    'Sunday': '4:00 PM - 9:00 PM',
    'Monday': 'Closed'
  },
  social: {
    resy: 'https://resy.com/cities/sf/venues/bosque'
  }
} as const;