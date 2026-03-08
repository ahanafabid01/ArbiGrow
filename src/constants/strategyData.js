const tierConfigs = [
  {
    prefix: "bs",
    name: "Basic Starter",
    audience: "For students and small investors",
    range: "$10 - $100",
    roi: { min: 1, max: 5 },
    packageStart: 1,
    amounts: [10, 25, 50, 75, 100],
  },
  {
    prefix: "pb",
    name: "Pro Builder",
    audience: "For medium investors",
    range: "$200 - $750",
    roi: { min: 1, max: 10 },
    packageStart: 6,
    amounts: [200, 300, 400, 500, 750],
  },
  {
    prefix: "ei",
    name: "Elite Investor",
    audience: "For serious investors",
    range: "$1,000 - $5,000",
    roi: { min: 1, max: 15 },
    packageStart: 11,
    amounts: [1000, 1500, 2000, 3000, 5000],
  },
  {
    prefix: "md",
    name: "Master Director",
    audience: "For big leaders",
    range: "$7,500 - $25,000",
    roi: { min: 1, max: 20 },
    packageStart: 16,
    amounts: [7500, 10000, 15000, 20000, 25000],
  },
  {
    prefix: "ga",
    name: "Global Ambassador",
    audience: "For VIP investors",
    range: "$35,000 - $100,000",
    roi: { min: 1, max: 25 },
    packageStart: 21,
    amounts: [35000, 50000, 65000, 80000, 100000],
  },
];

export const packages = tierConfigs.flatMap((tier) =>
  tier.amounts.map((amount, index) => ({
    id: `${tier.prefix}-${index + 1}`,
    tier: tier.name,
    name: `Package ${tier.packageStart + index}`,
    amount,
    roi: {
      min: tier.roi.min,
      max: tier.roi.max,
    },
    description: `${tier.name} package for ${tier.audience.toLowerCase()}.`,
  })),
);

export const tierGroups = tierConfigs.map((tier) => ({
  name: tier.name,
  range: tier.range,
  roiText: `${tier.roi.min}% to ${tier.roi.max}%`,
  description: tier.audience,
  packages: packages.filter((pkg) => pkg.tier === tier.name),
}));
