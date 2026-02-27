/**
 * Returns Tailwind classes for booking status badges.
 */
export const getStatusColor = (status) => {
    switch (status) {
        case 'completed':
            return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20';
        case 'in-progress':
            return 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20';
        case 'confirmed':
            return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20';
        case 'pending':
            return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
        case 'cancelled':
            return 'text-red-400 bg-red-500/10 border-red-500/20';
        default:
            return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
    }
};
/**
 * Returns a material-symbols icon name for a given booking status.
 */
export const getStatusIcon = (status) => {
    switch (status) {
        case 'completed':
            return 'check_circle';
        case 'in-progress':
            return 'local_shipping';
        case 'confirmed':
            return 'verified';
        case 'pending':
            return 'pending';
        case 'cancelled':
            return 'cancel';
        default:
            return 'help';
    }
};
