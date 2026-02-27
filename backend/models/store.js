export const analyticsData = {
    kpi: [
        { icon: 'scale', title: 'Total E-Waste Collected', value: '1,250 kg', trend: '+15.2%', positive: true },
        { icon: 'book_online', title: 'Bookings this Month', value: '312', trend: '+8.5%', positive: true },
        { icon: 'smartphone', title: 'Top Performing Category', value: 'Smartphones', trend: '-2.1%', positive: false },
    ],
    charts: {
        trends: [
            { name: '1', value: 20 }, { name: '4', value: 25 }, { name: '7', value: 40 },
            { name: '10', value: 48 }, { name: '13', value: 60 }, { name: '16', value: 68 },
            { name: '19', value: 75 }, { name: '22', value: 90 }, { name: '25', value: 105 },
            { name: '28', value: 115 }
        ],
        breakdown: [
            { name: 'Smartphones', value: 35, color: '#34D399' },
            { name: 'Laptops', value: 25, color: '#3B82F6' },
            { name: 'Batteries', value: 15, color: '#A855F7' },
            { name: 'Appliances', value: 15, color: '#EC4899' },
            { name: 'Cables', value: 10, color: '#F97316' },
        ]
    },
    leaderboard: [
        { rank: 1, name: 'GreenLeaf Recyclers', waste: 450.5, bookings: 102, score: 95 },
        { rank: 2, name: 'EcoCycle Inc. (You)', waste: 312.0, bookings: 88, score: 82, active: true },
        { rank: 3, name: 'Re-Tech Solutions', waste: 280.2, bookings: 75, score: 76 },
    ]
};
