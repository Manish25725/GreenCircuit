import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ActiveSessionsContent from '../components/ActiveSessionsContent.jsx';
const ActiveSessions = () => (_jsx(ActiveSessionsContent, { role: "business", initialSessions: [
        { id: '1', device: 'Windows PC - Chrome', location: 'New York, USA', ip: '192.168.1.1', lastActive: 'Active now', current: true },
        { id: '2', device: 'iPhone 14 Pro - Safari', location: 'New York, USA', ip: '192.168.1.45', lastActive: '2 hours ago', current: false },
        { id: '3', device: 'MacBook Pro - Chrome', location: 'San Francisco, USA', ip: '10.0.0.123', lastActive: '1 day ago', current: false },
    ] }));
export default ActiveSessions;
