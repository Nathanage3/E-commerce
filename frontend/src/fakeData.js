import cardImg from './assets/banner1.jpg';
import cardImg1 from './assets/card.jpg';
import cardImg2 from './assets/banner3.jpg';
export const categoriesData = [
  {
    id: 1,
    title: 'Development',
    sub: [
      { id: 1, title: 'Development' },
      { id: 2, title: 'Mobile Development' },
      { id: 3, title: 'Game Development' },
      { id: 4, title: 'App Development' },
      { id: 5, title: 'Cinema' },
      { id: 6, title: 'Photoshope' },
      { id: 7, title: 'Python' },
      { id: 8, title: 'Javascript' },
      { id: 9, title: 'HTML' },
      { id: 10, title: 'CSS' },
      { id: 11, title: 'PHP' },
      { id: 12, title: 'Camera' },
      { id: 13, title: 'Cinema' },
      { id: 14, title: 'Photoshope' },
      { id: 15, title: 'Python' },
      { id: 16, title: 'Javascript' },
      { id: 17, title: 'HTML' },
      { id: 18, title: 'CSS' },
      { id: 19, title: 'PHP' },
      { id: 20, title: 'Camera' },
    ],
  },
  {
    id: 2,
    title: 'Business',
    sub: [
      { id: 1, title: 'Business' },
      { id: 2, title: 'Mobile Development' },
      { id: 3, title: 'Web Development' },
      { id: 4, title: 'Mobile Development' },
      { id: 5, title: 'Web Development' },
      { id: 6, title: 'Mobile Development' },
      { id: 7, title: 'Web Development' },
    ],
  },
  {
    id: 3,
    title: 'Finance & Accounting',
    sub: [
      { id: 1, title: 'Finance & Accounting' },
      { id: 2, title: 'Mobile Development' },
      { id: 3, title: 'Web Development' },
      { id: 4, title: 'Mobile Development' },
      { id: 5, title: 'Web Development' },
      { id: 6, title: 'Mobile Development' },
      { id: 7, title: 'Web Development' },
    ],
  },
  {
    id: 4,
    title: 'IT & Software',
    sub: [
      { id: 1, title: 'Web Development' },
      { id: 2, title: 'Mobile Development' },
      { id: 3, title: 'Web Development' },
      { id: 4, title: 'Mobile Development' },
      { id: 5, title: 'Web Development' },
      { id: 6, title: 'Mobile Development' },
    ],
  },
  {
    id: 5,
    title: 'Office Productivity',
    sub: [
      { id: 1, title: 'Web Development' },
      { id: 2, title: 'Mobile Development' },
      { id: 3, title: 'Web Development' },
      { id: 4, title: 'Mobile Development' },
      { id: 5, title: 'Web Development' },
      { id: 6, title: 'Mobile Development' },
    ],
  },
  {
    id: 6,
    title: 'Personal Development',
    sub: [
      { id: 1, title: 'Personal Development' },
      { id: 2, title: 'Mobile Development' },
      { id: 3, title: 'Web Development' },
      { id: 4, title: 'Mobile Development' },
      { id: 5, title: 'Web Development' },
      { id: 6, title: 'Mobile Development' },
    ],
  },
  {
    id: 7,
    title: 'Game Development',

    sub: [
      { id: 1, title: 'Personal Development' },
      { id: 2, title: 'Mobile Development' },
      { id: 3, title: 'Web Development' },
      { id: 4, title: 'Mobile Development' },
      { id: 5, title: 'Web Development' },
      { id: 6, title: 'Mobile Development' },
    ],
  },
  {
    id: 8,
    title: 'Data Science',
    sub: [
      { id: 1, title: 'Personal Development' },
      { id: 2, title: 'Mobile Development' },
      { id: 3, title: 'Web Development' },
      { id: 4, title: 'Mobile Development' },
      { id: 5, title: 'Web Development' },
      { id: 6, title: 'Mobile Development' },
    ],
  },
  {
    id: 9,
    title: 'Software Development Tools',
    sub: [
      { id: 1, title: 'Personal Development' },
      { id: 2, title: 'Mobile Development' },
      { id: 3, title: 'Web Development' },
      { id: 4, title: 'Mobile Development' },
      { id: 5, title: 'Web Development' },
      { id: 6, title: 'Mobile Development' },
    ],
  },
  {
    id: 10,
    title: 'No-code Development',
    sub: [
      { id: 1, title: 'Personal Development' },
      { id: 2, title: 'Mobile Development' },
      { id: 3, title: 'Web Development' },
      { id: 4, title: 'Mobile Development' },
      { id: 5, title: 'Web Development' },
      { id: 6, title: 'Mobile Development' },
    ],
  },
];

export const courseData = [
  {
    category: ['business', 'management', 'iso 800'],
    createdBy: 'Jack Black',
    id: 1,
    img: cardImg1,
    title: 'Learn Python: The Complete Python Programming Course',
    subTitle:
      'Learn A-Z everything about Python, from the basics, to advanced topics like Python GUI, Python Data Analysis, and more',
    price: 600,
    oldPrice: 3299,
    stars: 3.5,
    ratingCount: 5,
    updatedDate: new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
    }).format(new Date()),
    courseDuration: 1000000,
    level: 'Beginner Level',
    detail:
      'Python For Beginners : This course is meant for absolute beginners in programming or in python.',
  },
  {
    category: ['business', 'management', 'iso 800'],
    createdBy: 'Jack Black',
    id: 2,
    img: cardImg,
    title: 'Learn Python: The Complete Python Programming Course',
    subTitle:
      'Learn A-Z everything about Python, from the basics, to advanced topics like Python GUI, Python Data Analysis, and more',
    price: 600,
    oldPrice: 3299,
    stars: 3.5,
    ratingCount: 5,
    updatedDate: new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
    }).format(new Date()),
    courseDuration: 1000000,
    level: 'Beginner Level',
    detail:
      'Python For Beginners : This course is meant for absolute beginners in programming or in python.',
  },
  {
    category: ['business', 'management', 'iso 800'],
    createdBy: 'Jack Black',
    id: 3,
    img: cardImg2,
    title: 'Learn Python: The Complete Python Programming Course',
    subTitle:
      'Learn A-Z everything about Python, from the basics, to advanced topics like Python GUI, Python Data Analysis, and more',
    price: 600,
    oldPrice: 3299,
    stars: 3.5,
    ratingCount: 5,
    updatedDate: new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
    }).format(new Date()),
    courseDuration: 1000000,
    level: 'Beginner Level',
    detail:
      'Python For Beginners : This course is meant for absolute beginners in programming or in python.',
  },
  {
    category: ['business', 'management', 'iso 800'],
    createdBy: 'Jack Black',
    id: 4,
    img: cardImg,
    title: 'Learn Python: The Complete Python Programming Course',
    subTitle:
      'Learn A-Z everything about Python, from the basics, to advanced topics like Python GUI, Python Data Analysis, and more',
    price: 600,
    oldPrice: 3299,
    stars: 3.5,
    ratingCount: 5,
    updatedDate: new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
    }).format(new Date()),
    courseDuration: 1000000,
    level: 'Beginner Level',
    detail:
      'Python For Beginners : This course is meant for absolute beginners in programming or in python.',
  },
  {
    category: ['business', 'management', 'iso 800'],
    createdBy: 'Jack Black',
    id: 5,
    img: cardImg1,
    title: 'Learn Python: The Complete Python Programming Course',
    subTitle:
      'Learn A-Z everything about Python, from the basics, to advanced topics like Python GUI, Python Data Analysis, and more',
    price: 600,
    oldPrice: 3299,
    stars: 3.5,
    ratingCount: 5,
    updatedDate: new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
    }).format(new Date()),
    courseDuration: 1000000,
    level: 'Beginner Level',
    detail:
      'Python For Beginners : This course is meant for absolute beginners in programming or in python.',
  },
  {
    category: ['business', 'management', 'iso 800'],
    createdBy: 'Jack Black',
    id: 6,
    img: cardImg,
    title: 'Learn Python: The Complete Python Programming Course',
    subTitle:
      'Learn A-Z everything about Python, from the basics, to advanced topics like Python GUI, Python Data Analysis, and more',
    price: 600,
    oldPrice: 3299,
    stars: 3.5,
    ratingCount: 5,
    updatedDate: new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
    }).format(new Date()),
    courseDuration: 1000000,
    level: 'Beginner Level',
    detail:
      'Python For Beginners : This course is meant for absolute beginners in programming or in python.',
  },
  {
    category: ['business', 'management', 'iso 800'],
    createdBy: 'Jack Black',
    id: 7,
    img: cardImg2,
    title: 'Learn Python: The Complete Python Programming Course',
    subTitle:
      'Learn A-Z everything about Python, from the basics, to advanced topics like Python GUI, Python Data Analysis, and more',
    price: 600,
    oldPrice: 3299,
    stars: 3.5,
    ratingCount: 5,
    updatedDate: new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
    }).format(new Date()),
    courseDuration: 1000000,
    level: 'Beginner Level',
    detail:
      'Python For Beginners : This course is meant for absolute beginners in programming or in python.',
  },
  {
    category: ['business', 'management', 'iso 800'],
    createdBy: 'Jack Black',
    id: 8,
    img: cardImg,
    title: 'Learn Python: The Complete Python Programming Course',
    subTitle:
      'Learn A-Z everything about Python, from the basics, to advanced topics like Python GUI, Python Data Analysis, and more',
    price: 600,
    oldPrice: 3299,
    stars: 3.5,
    ratingCount: 5,
    updatedDate: new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
    }).format(new Date()),
    courseDuration: 1000000,
    level: 'Beginner Level',
    detail:
      'Python For Beginners : This course is meant for absolute beginners in programming or in python.',
  },
  {
    category: ['business', 'management', 'iso 800'],
    createdBy: 'Jack Black',
    id: 9,
    img: cardImg2,
    title: 'Learn Python: The Complete Python Programming Course',
    subTitle:
      'Learn A-Z everything about Python, from the basics, to advanced topics like Python GUI, Python Data Analysis, and more',
    price: 600,
    oldPrice: 3299,
    stars: 3.5,
    ratingCount: 5,
    updatedDate: new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
    }).format(new Date()),
    courseDuration: 1000000,
    level: 'Beginner Level',
    detail:
      'Python For Beginners : This course is meant for absolute beginners in programming or in python.',
  },
  {
    category: ['business', 'management', 'iso 800'],
    createdBy: 'Jack Black',
    id: 10,
    img: cardImg,
    title: 'Learn Python: The Complete Python Programming Course',
    subTitle:
      'Learn A-Z everything about Python, from the basics, to advanced topics like Python GUI, Python Data Analysis, and more',
    price: 600,
    oldPrice: 3299,
    stars: 3.5,
    ratingCount: 5,
    updatedDate: new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
    }).format(new Date()),
    courseDuration: 1000000,
    level: 'Beginner Level',
    detail:
      'Python For Beginners : This course is meant for absolute beginners in programming or in python.',
  },
];
