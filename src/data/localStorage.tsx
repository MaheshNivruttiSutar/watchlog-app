export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const users: User[] = [
  {
    id: 1,
    firstName: 'Arjun',
    lastName: 'Sharma',
    email: 'arjunsharma@demo.com',
    password: '123',
  },
  {
    id: 2,
    firstName: 'Sneha',
    lastName: 'Patel',
    email: 'snehapatel@demo.com',
    password: '123',
  },
  {
    id: 3,
    firstName: 'Ravi',
    lastName: 'Kumar',
    email: 'ravikumar@demo.com',
    password: '123',
  },
  {
    id: 4,
    firstName: 'Priya',
    lastName: 'Singh',
    email: 'priyasingh@demo.com',
    password: '123',
  },
  {
    id: 5,
    firstName: 'Karan',
    lastName: 'Mehta',
    email: 'karanmehta@demo.com',
    password: '123',
  },
];

export const setLocalStorage = () => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const getLocalStorage = (): User[] => {
  const usersRaw = localStorage.getItem('users');
  return usersRaw ? (JSON.parse(usersRaw) as User[]) : [];
};
