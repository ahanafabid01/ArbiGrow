export const mockMarketPrices = {
  btc: { price: 94523.45, change: 2.34 },
  eth: { price: 3421.67, change: -1.23 },
  arb: { price: 1.89, change: 5.67 }
};

// Mock user data
export const mockUserData = {
  fullName: 'John Anderson',
  username: 'john_anderson',
  email: 'john.anderson@arbigrow.com',
  phone: '+1 (555) 123-4567',
  country: 'United States',
  isVerified: true,
  referralLink: 'https://arbigrow.com/ref/john_anderson',
  wallets: {
    main: 1250.50,
    deposit: 5000.00,
    withdraw: 1850.75,
    referral: 420.30,
    generation: 680.90,
    arbx: 100.00,
    mining: 25.50
  }
};

// Fixed referral data — all 5 levels with real examples
export const fixedReferralData = [
  {
    level: 1, commissionRate: '10%', totalEarnings: 180.50,
    users: [
      { id: 'l1-1', name: 'Michael Smith',   username: 'michael_smith',   level: 1, joinDate: 'Dec 10, 2024', totalEarnings: 85.00, status: 'active',   referredBy: 'john_anderson', directReferrals: 3 },
      { id: 'l1-2', name: 'Ethan Harris',    username: 'ethan_harris',    level: 1, joinDate: 'Jan 4, 2025',  totalEarnings: 60.50, status: 'active',   referredBy: 'john_anderson', directReferrals: 2 },
      { id: 'l1-3', name: 'Oliver Martinez', username: 'oliver_martinez', level: 1, joinDate: 'Jan 20, 2025', totalEarnings: 35.00, status: 'inactive', referredBy: 'john_anderson', directReferrals: 1 },
    ]
  },
  {
    level: 2, commissionRate: '5%', totalEarnings: 95.20,
    users: [
      { id: 'l2-1', name: 'Sarah Johnson',     username: 'sarah_johnson',     level: 2, joinDate: 'Dec 18, 2024', totalEarnings: 42.00, status: 'active',   referredBy: 'michael_smith',   directReferrals: 2 },
      { id: 'l2-2', name: 'Isabella Gonzalez', username: 'isabella_gonzalez', level: 2, joinDate: 'Jan 2, 2025',  totalEarnings: 28.20, status: 'active',   referredBy: 'michael_smith',   directReferrals: 1 },
      { id: 'l2-3', name: 'Mia Jackson',       username: 'mia_jackson',       level: 2, joinDate: 'Jan 12, 2025', totalEarnings: 15.00, status: 'active',   referredBy: 'ethan_harris',    directReferrals: 1 },
      { id: 'l2-4', name: 'Chloe Brown',       username: 'chloe_brown',       level: 2, joinDate: 'Feb 1, 2025',  totalEarnings: 10.00, status: 'inactive', referredBy: 'oliver_martinez', directReferrals: 1 },
    ]
  },
  {
    level: 3, commissionRate: '3%', totalEarnings: 54.80,
    users: [
      { id: 'l3-1', name: 'David Lee',          username: 'david_lee',          level: 3, joinDate: 'Jan 5, 2025',  totalEarnings: 22.50, status: 'active',   referredBy: 'sarah_johnson',     directReferrals: 2 },
      { id: 'l3-2', name: 'William Rodriguez',  username: 'william_rodriguez',  level: 3, joinDate: 'Jan 14, 2025', totalEarnings: 15.30, status: 'active',   referredBy: 'sarah_johnson',     directReferrals: 1 },
      { id: 'l3-3', name: 'Lucas Thompson',     username: 'lucas_thompson',     level: 3, joinDate: 'Jan 22, 2025', totalEarnings: 10.00, status: 'inactive', referredBy: 'isabella_gonzalez', directReferrals: 1 },
      { id: 'l3-4', name: 'Alexander White',    username: 'alexander_white',    level: 3, joinDate: 'Feb 3, 2025',  totalEarnings: 7.00,  status: 'active',   referredBy: 'mia_jackson',       directReferrals: 1 },
    ]
  },
  {
    level: 4, commissionRate: '2%', totalEarnings: 28.40,
    users: [
      { id: 'l4-1', name: 'Emma Wilson',        username: 'emma_wilson',        level: 4, joinDate: 'Jan 10, 2025', totalEarnings: 12.00, status: 'active',   referredBy: 'david_lee',         directReferrals: 2 },
      { id: 'l4-2', name: 'James Martinez',     username: 'james_martinez',     level: 4, joinDate: 'Jan 19, 2025', totalEarnings: 8.40,  status: 'active',   referredBy: 'david_lee',         directReferrals: 1 },
      { id: 'l4-3', name: 'Ava Lopez',          username: 'ava_lopez',          level: 4, joinDate: 'Jan 25, 2025', totalEarnings: 5.00,  status: 'inactive', referredBy: 'william_rodriguez', directReferrals: 1 },
      { id: 'l4-4', name: 'Charlotte Anderson', username: 'charlotte_anderson', level: 4, joinDate: 'Feb 6, 2025',  totalEarnings: 3.00,  status: 'active',   referredBy: 'lucas_thompson',    directReferrals: 1 },
      { id: 'l4-5', name: 'Amelia Taylor',      username: 'amelia_taylor',      level: 4, joinDate: 'Feb 10, 2025', totalEarnings: 0.00,  status: 'active',   referredBy: 'alexander_white',   directReferrals: 1 },
    ]
  },
  {
    level: 5, commissionRate: '1%', totalEarnings: 11.30,
    users: [
      { id: 'l5-1', name: 'Robert Brown',       username: 'robert_brown',       level: 5, joinDate: 'Jan 15, 2025', totalEarnings: 4.50, status: 'active',   referredBy: 'emma_wilson',        directReferrals: 0 },
      { id: 'l5-2', name: 'Olivia Davis',       username: 'olivia_davis',       level: 5, joinDate: 'Jan 21, 2025', totalEarnings: 3.20, status: 'active',   referredBy: 'emma_wilson',        directReferrals: 0 },
      { id: 'l5-3', name: 'Sophia Garcia',      username: 'sophia_garcia',      level: 5, joinDate: 'Jan 28, 2025', totalEarnings: 2.10, status: 'inactive', referredBy: 'james_martinez',     directReferrals: 0 },
      { id: 'l5-4', name: 'Benjamin Hernandez', username: 'benjamin_hernandez', level: 5, joinDate: 'Feb 2, 2025',  totalEarnings: 1.50, status: 'active',   referredBy: 'ava_lopez',          directReferrals: 0 },
      { id: 'l5-5', name: 'Noah Williams',      username: 'noah_williams',      level: 5, joinDate: 'Feb 8, 2025',  totalEarnings: 0.00, status: 'active',   referredBy: 'charlotte_anderson', directReferrals: 0 },
    ]
  },
];

// Mock transaction data
 export const generateMockTransactions = () => {
  const types = ['Deposit', 'Package Purchase', 'Profit Credit', 'Withdrawal', 'Referral Bonus', 'Generation Bonus', 'Mining Reward', 'Admin Adjustment'];
  const wallets = ['Main Wallet', 'Deposit Wallet', 'Withdraw Wallet', 'Referral Wallet', 'Generation Wallet', 'ARBX Wallet'];
  const statuses = ['Completed', 'Pending', 'Processing'];
  const currencies = ['USDT', 'ARBX'];
  
  return Array.from({ length: 95 }, (_, i) => ({
    id: i + 1,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    type: types[Math.floor(Math.random() * types.length)],
    wallet: wallets[Math.floor(Math.random() * wallets.length)],
    amount: (Math.random() * 1000).toFixed(2),
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};
