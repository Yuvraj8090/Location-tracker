// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Dummy Data  (replace with API calls in production)
// ─────────────────────────────────────────────────────────────────────────────

export interface Checkpoint {
  id: string;
  label: string;
  reached: boolean;
  lat?: number;
  lng?: number;
}

export interface TaskLocation {
  lat: number;
  lng: number;
  label: string;
}

export type TaskStatus = 'assigned' | 'started' | 'reached' | 'completed';
export type Priority   = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  client: string;
  status: TaskStatus;
  priority: Priority;
  assignedAt: string;
  deadline: string;
  start: TaskLocation;
  end: TaskLocation;
  distance: string;
  eta: string;
  checkpoints: Checkpoint[];
  notes?: string;
}

export interface FieldAgent {
  id: string;
  name: string;
  avatar: string;
  employeeId: string;
  phone: string;
  zone: string;
  role: string;
  mapX: number;
  mapY: number;
  status: 'started' | 'assigned' | 'idle';
  currentTask: string;
}

// ── Current logged-in user ───────────────────────────────────────────────────
export const CURRENT_USER = {
  id: 'USR-001',
  name: 'Arjun Sharma',
  avatar: 'AS',
  employeeId: 'EMP-2024-047',
  phone: '+91 98765 43210',
  zone: 'North Delhi Zone',
  role: 'Field Agent',
};

// ── Tasks ────────────────────────────────────────────────────────────────────
export const TASKS: Task[] = [
  {
    id: 'TSK-1001',
    title: 'Client Visit – Rajiv Nagar',
    client: 'Rajiv Nagar Branch',
    status: 'started',
    priority: 'high',
    assignedAt: '08:00 AM',
    deadline: '10:30 AM',
    start: { lat: 28.6692, lng: 77.2287, label: 'Head Office, Connaught Place' },
    end:   { lat: 28.6985, lng: 77.1518, label: 'Rajiv Nagar Client Office'   },
    distance: '12.4 km',
    eta: '28 min',
    notes: 'Carry installation kit. Contact Mr. Sharma on arrival.',
    checkpoints: [
      { id: 'CP1', label: 'Karol Bagh Checkpoint',  reached: true  },
      { id: 'CP2', label: 'Rajouri Garden Signal',  reached: true  },
      { id: 'CP3', label: 'Rajiv Nagar Entry Gate', reached: false },
    ],
  },
  {
    id: 'TSK-1002',
    title: 'Equipment Delivery – Dwarka',
    client: 'Dwarka Sector 12',
    status: 'assigned',
    priority: 'medium',
    assignedAt: '11:00 AM',
    deadline: '01:00 PM',
    start: { lat: 28.6985, lng: 77.1518, label: 'Rajiv Nagar' },
    end:   { lat: 28.5921, lng: 77.0460, label: 'Dwarka Sector 12' },
    distance: '18.7 km',
    eta: '45 min',
    notes: 'Handle with care. Fragile equipment.',
    checkpoints: [
      { id: 'CP1', label: 'Najafgarh Road Junction', reached: false },
      { id: 'CP2', label: 'Dwarka Mor Metro',        reached: false },
      { id: 'CP3', label: 'Sector 12 Main Gate',     reached: false },
    ],
  },
  {
    id: 'TSK-1003',
    title: 'Survey – Rohini Sector 3',
    client: 'Rohini District Office',
    status: 'completed',
    priority: 'low',
    assignedAt: '06:30 AM',
    deadline: '08:00 AM',
    start: { lat: 28.7041, lng: 77.1025, label: 'Pitampura Depot' },
    end:   { lat: 28.7192, lng: 77.1068, label: 'Rohini Sector 3 Office' },
    distance: '5.2 km',
    eta: 'Completed',
    notes: 'Submit survey form to district officer.',
    checkpoints: [
      { id: 'CP1', label: 'Pitampura Metro Station', reached: true },
      { id: 'CP2', label: 'Rohini West',             reached: true },
      { id: 'CP3', label: 'District Office Gate',    reached: true },
    ],
  },
];

// ── Other field agents (for map view) ────────────────────────────────────────
export const FIELD_AGENTS: FieldAgent[] = [
  {
    id: 'USR-001', name: 'Arjun Sharma',  avatar: 'AS',
    employeeId: 'EMP-2024-047', phone: '+91 98765 43210',
    zone: 'North Delhi', role: 'Field Agent',
    mapX: 0.68, mapY: 0.38, status: 'started',  currentTask: 'Client Visit',
  },
  {
    id: 'USR-002', name: 'Priya Patel',   avatar: 'PP',
    employeeId: 'EMP-2024-031', phone: '+91 98765 11111',
    zone: 'West Delhi',  role: 'Field Agent',
    mapX: 0.40, mapY: 0.48, status: 'started',  currentTask: 'Equipment Delivery',
  },
  {
    id: 'USR-003', name: 'Rahul Gupta',   avatar: 'RG',
    employeeId: 'EMP-2024-055', phone: '+91 98765 22222',
    zone: 'South Delhi', role: 'Field Agent',
    mapX: 0.75, mapY: 0.56, status: 'assigned', currentTask: 'Survey Work',
  },
];

// ── Dashboard stats ──────────────────────────────────────────────────────────
export const DASHBOARD_STATS = {
  todayDistance: '23.8 km',
  tasksCompleted: 1,
  tasksTotal: 3,
  hoursActive: '4h 12m',
  deviations: 0,
  routeProgress: 67,
};

// ── Security checks ──────────────────────────────────────────────────────────
export const SECURITY_CHECKS = [
  { key: 'devMode',     label: 'Developer Options',  desc: 'Android dev mode disabled',      icon: 'settings-outline',      passed: true  },
  { key: 'usbDebug',    label: 'USB Debugging',       desc: 'ADB connection blocked',          icon: 'flash-outline',         passed: true  },
  { key: 'emulator',    label: 'Emulator Detected',   desc: 'Running on real physical device', icon: 'warning-outline',       passed: true  },
  { key: 'mockGps',     label: 'Mock / Fake GPS',      desc: 'Location spoofing blocked',       icon: 'location-outline',      passed: true  },
  { key: 'rooted',      label: 'Root / Jailbreak',    desc: 'Device integrity intact',         icon: 'lock-closed-outline',   passed: true  },
  { key: 'screenRec',   label: 'Screen Recording',    desc: 'Screen capture prevention active',icon: 'camera-outline',        passed: true  },
];

export const GPS_STATUS = {
  accuracy: '±3.2 m',
  speed: '42 km/h',
  satellites: '12 locked',
  mockDetected: false,
  signal: 'Strong',
};
