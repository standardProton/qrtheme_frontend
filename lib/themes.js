
export const theme_data = {
    '1': {
        id: 1,
        name: 'Succulents',
        slug: 'succulents',
        description: "Make a QR Code for gardening, nature enthusiasts, and those with a green thumb!",
        related_themes: [ 2 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '2': {
        id: 2,
        name: 'Flowers',
        slug: 'flowers',
        description: "Make a QR Code for family get-togethers, weddings, and other special occasions!",
        related_themes: [ 14, 16, 4, 1 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '3': {
        id: 3,
        name: 'Vanilla & Chocolate Cake',
        slug: 'cake',
        description: "A QR Code for celebrations, bakers, cake decorators, and more!",
        related_themes: [ 4, 17 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '4': {
        id: 4,
        name: 'Velvet Wedding Cake',
        slug: 'wedding-cake',
        description: "Make a QR Code perfect for weddings, get-togethers, and celebrations.",
        related_themes: [ 3, 16 ],
        hidden: true,
        price_ids: [ '', '', '' ]
      },
      '5': {
        id: 5,
        name: 'Sushi',
        slug: 'sushi',
        description: "A QR Code for those who love sushi and the sushi chefs (itamae) of the world. ",
        related_themes: [ 6 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '6': {
        id: 6,
        name: 'Bowl of Rice',
        slug: 'rice',
        description: "A QR Code for a healthy, low-fat, vegan, and organic lifestyle.",
        related_themes: [ 5, 17 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '7': {
        id: 7,
        name: 'Bowl of Salad',
        slug: 'salad',
        description: "A QR Code for a healthy, low-fat, vegan, and organic lifestyle.",
        related_themes: [ 15, 17 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '8': {
        id: 8,
        name: 'Forest & Mountains',
        slug: 'forest-mountain',
        description: "A QR Code for the hikers and nature enjoyers of the world.",
        related_themes: [ 11, 23 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '9': {
        id: 9,
        name: 'Carribean Beach Vacation',
        slug: 'beach',
        description: "Travel in style with a sandy beach-themed QR Code!",
        related_themes: [ 16 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '10': {
        id: 10,
        name: 'Modern Mansion',
        slug: 'modern-mansion',
        description: "",
        related_themes: [ 16 ],
        hidden: true,
        price_ids: [ '', '', '' ]
      },
      '11': {
        id: 11,
        name: 'Snowy Ski Mountain',
        slug: 'snowy-mountain',
        description: "Can you ski down these slopes?",
        related_themes: [ 8, 23 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '12': {
        id: 12,
        name: 'Pixels & Bits',
        slug: 'pixels',
        description: "A modern take on the pixels in a QR Code.",
        related_themes: [ 13 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '13': {
        id: 13,
        name: 'Gold Bank Vault',
        slug: 'gold',
        description: "Send money, cryptocurrency, or actual gold!",
        related_themes: [],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '14': {
        id: 14,
        name: 'Flower Vase',
        slug: 'flower-vase',
        description: "Perfect for special occasions and get-togethers!",
        related_themes: [ 2 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '16': {
        id: 16,
        name: 'Above the Clouds',
        slug: 'sky',
        description: "A QR code to show the beautiful view of the sky from an airplane.",
        related_themes: [ 23 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '17': {
        id: 17,
        name: 'Pizza',
        slug: 'pizza',
        description: "A QR Code for those who love Italian food!",
        related_themes: [ 3, 7 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
      '18': {
        id: 18,
        name: 'Birthday Cake',
        slug: 'birthday-cake',
        description: "",
        related_themes: [],
        hidden: true,
        price_ids: [ '', '', '' ]
      },
      '21': {
        id: 21,
        name: 'Honey Combs',
        slug: 'honey',
        description: "",
        related_themes: [],
        hidden: true,
        price_ids: [ '', '', '' ]
      },
      '22': {
        id: 22,
        name: 'MC Escher',
        slug: 'salt-pepper',
        description: "",
        related_themes: [],
        hidden: true,
        price_ids: [ '', '', '' ]
      },
      '23': {
        id: 23,
        name: 'Underwater Coral Reef',
        slug: 'coral-reef',
        description: "Make a QR Code showing the natural beauty that lies in the seas.",
        related_themes: [ 8, 16 ],
        hidden: false,
        price_ids: [ '', '', '' ]
      },
}

export const slug_map = {
  succulents: 1,
  flowers: 2,
  cake: 3,
  'wedding-cake': 4,
  sushi: 5,
  rice: 6,
  salad: 7,
  'forest-mountain': 8,
  beach: 9,
  'modern-mansion': 10,
  'snowy-mountain': 11,
  pixels: 12,
  gold: 13,
  'flower-vase': 14,
  sky: 16,
  pizza: 17,
  'coral-reef': 23,
}

export const recommended = [14, 16, 17, 23, 3, 1, 7, 6]