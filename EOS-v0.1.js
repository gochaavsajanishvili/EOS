import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    addDoc, 
    doc, 
    setDoc, 
    getDocs,
    getDoc,
    query,
    where,
    deleteDoc,
    updateDoc,
    limit,
    orderBy
} from 'firebase/firestore';
import { setLogLevel } from 'firebase/firestore';

// --- SVG Icons (Components) ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const VisionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 18a6 6 0 0 0-6-6 6 6 0 0 0-6 6"/><path d="M12 6a6 6 0 0 1 6 6 6 6 0 0 1 6-6"/></svg>;
const DepartmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v4"/><path d="M14 11v4"/><path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>;
const PeopleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const RocksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
const MeetingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
const Spinner = () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6l1-4h12l1 4"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;


// --- Firebase Configuration ---
// These global variables are provided by the execution environment.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : undefined;

let app;
let db;
let auth;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    setLogLevel('debug');
} catch (e) {
    console.error("Error initializing Firebase:", e);
}


// --- Main App Component ---
export default function App() {
    const [page, setPage] = useState('dashboard');
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) return;
        const auth_init = async () => {
            if (initialAuthToken) {
                try {
                    await signInWithCustomToken(auth, initialAuthToken);
                     console.log("Signed in with custom token.");
                } catch (error) {
                    console.error("Error signing in with custom token:", error);
                }
            } else {
                 try {
                    await signInAnonymously(auth);
                    console.log("Signed in anonymously.");
                } catch(error) {
                    console.error("Error signing in anonymously:", error);
                }
            }
        };
        auth_init();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUserId(currentUser.uid || crypto.randomUUID());
            } else {
                setUser(null);
                setUserId(crypto.randomUUID());
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Effect to seed mock data if the database is empty
    useEffect(() => {
        if (!db || !userId) return;

        const seedMockData = async () => {
            const departmentsQuery = query(collection(db, `/artifacts/${appId}/public/data/departments`));
            const departmentsSnapshot = await getDocs(departmentsQuery);
            if (!departmentsSnapshot.empty) {
                console.log("Data already exists. Skipping mock data seeding.");
                return;
            }

            console.log("No data found. Seeding new, diverse mock data...");

            try {
                // 1. Seed Vision
                const visionDocRef = doc(db, `/artifacts/${appId}/public/data/vision/visionDoc`);
                await setDoc(visionDocRef, { text: "To become the most trusted and technologically advanced supplier of aerial lift equipment globally, revolutionizing how our customers build the world." });

                // 2. Seed Departments
                const deptsRef = collection(db, `/artifacts/${appId}/public/data/departments`);
                const opsRef = await addDoc(deptsRef, { name: 'Operations' });
                const devRef = await addDoc(deptsRef, { name: 'Development' });
                const markRef = await addDoc(deptsRef, { name: 'Marketing' });
                const finRef = await addDoc(deptsRef, { name: 'Finance' });

                // 3. Seed People
                const peopleRef = collection(db, `/artifacts/${appId}/public/data/people`);
                const carlosRef = await addDoc(peopleRef, { name: 'Carlos Rey', departmentId: opsRef.id });
                const sofiaRef = await addDoc(peopleRef, { name: 'Sofia Moreno', departmentId: opsRef.id });
                const javierRef = await addDoc(peopleRef, { name: 'Javier Costa', departmentId: opsRef.id });
                const elenaRef = await addDoc(peopleRef, { name: 'Elena Vidal', departmentId: devRef.id });
                const marcoRef = await addDoc(peopleRef, { name: 'Marco Ruiz', departmentId: devRef.id });
                const isabellaRef = await addDoc(peopleRef, { name: 'Isabella Soler', departmentId: markRef.id });
                
                // 4. Seed Company Rocks
                const companyRocksRef = collection(db, `/artifacts/${appId}/public/data/companyRocks`);
                await addDoc(companyRocksRef, { title: 'Launch Unified Listing Platform V2 to support Webflow integration by end of Q4', status: 'On Track' });
                await addDoc(companyRocksRef, { title: 'Reduce average equipment repair-to-ready time from 14 days to 10 days', status: 'On Track' });
                await addDoc(companyRocksRef, { title: 'Increase online sales leads by 30% through targeted ad campaigns', status: 'Done' });

                // 5. Seed Individual Rocks
                const indRocksRef = collection(db, `/artifacts/${appId}/public/data/individualRocks`);
                await addDoc(indRocksRef, { title: 'Onboard 3 new major equipment brokers to our sales network', ownerId: carlosRef.id, status: 'On Track' });
                await addDoc(indRocksRef, { title: 'Digitize 100% of incoming inspection reports using the new tech tool', ownerId: sofiaRef.id, status: 'On Track' });
                await addDoc(indRocksRef, { title: 'Finalize the database schema and API endpoints for Listing Platform V2', ownerId: elenaRef.id, status: 'On Track' });
                await addDoc(indRocksRef, { title: 'Complete the UI/UX redesign for the new listing creation flow', ownerId: marcoRef.id, status: 'Off Track' });
                await addDoc(indRocksRef, { title: 'Optimize Google Ads campaigns to achieve a 15% lower cost-per-acquisition', ownerId: isabellaRef.id, status: 'Done' });

                // 6. Seed L10 Meetings
                const meetingsRef = collection(db, `/artifacts/${appId}/public/data/l10Meetings`);
                await addDoc(meetingsRef, {
                    departmentId: opsRef.id,
                    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
                    notes: "Operations Sync:\n- Shipment of 3 boom lifts from Germany is delayed by 48 hours. Customs issue. \n- Sofia reports 95% adoption of the new inspection tool; mechanics love it. Her rock is on track.\n- Carlos has a major client (BigBuild Corp) ready to purchase a reconditioned unit, but it's the one Sofia's team is currently repairing. We need to prioritize it.\n- To-do: Javier to contact the freight forwarder for an hourly update on the German shipment.\n- To-do: Sofia to move the BigBuild Corp unit to the front of the repair queue."
                });
                await addDoc(meetingsRef, {
                    departmentId: devRef.id,
                    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
                    notes: "Development Sprint Review:\n- Elena's work on the V2 backend is complete and documented in Confluence. Rock is on track.\n- Marco's UI redesign is blocked. The new Webflow API has stricter rate limits than anticipated, causing timeouts in the dev environment. This puts his rock 'Off Track'.\n- Issue: Mechanics reported a bug in the inspection tool where photos upload in the wrong orientation on certain Android devices. \n- Decision: Elena to pair-program with Marco for a day to implement a caching strategy for the Webflow API calls.\n- To-do: Create a ticket in Jira for the image orientation bug (#INSP-481)."
                });
                await addDoc(meetingsRef, {
                    departmentId: markRef.id,
                    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
                    notes: "Marketing & Growth Meeting:\n- Isabella confirms her rock is Done. Google Ads CPA is down 18%.\n- Great success with the recent campaign on LinkedIn targeting construction managers.\n- Discussion on content strategy for the new line of electric lifts we're acquiring. \n- To-do: Isabella to develop a 3-month content calendar for the Shopify blog, focusing on 'electric vs. diesel' comparisons."
                });

                console.log("Diverse mock data seeded successfully.");

            } catch (error) {
                console.error("Error seeding mock data: ", error);
            }
        };

        seedMockData();

    }, [userId]);

    const renderPage = () => {
        if (loading || !userId) {
            return <div className="flex items-center justify-center h-full"><Spinner /> <span className="ml-2 text-gray-300">Initializing...</span></div>;
        }

        switch (page) {
            case 'dashboard':
                return <Dashboard userId={userId} />;
            case 'vision':
                return <Vision userId={userId} />;
            case 'departments':
                return <Departments userId={userId}/>;
            case 'people':
                return <People userId={userId} />;
            case 'rocks':
                return <Rocks userId={userId}/>;
            case 'meetings':
                return <Meetings userId={userId}/>;
            case 'ai-analysis':
                return <AiAnalysis userId={userId}/>;
            default:
                return <Dashboard userId={userId} />;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans flex">
            <Sidebar currentPage={page} setPage={setPage} />
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
}

// --- Sidebar Component ---
const Sidebar = ({ currentPage, setPage }) => {
    const navItems = [
        { id: 'dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { id: 'vision', icon: <VisionIcon />, label: 'Company Vision' },
        { id: 'departments', icon: <DepartmentIcon />, label: 'Departments' },
        { id: 'people', icon: <PeopleIcon />, label: 'People' },
        { id: 'rocks', icon: <RocksIcon />, label: 'Quarterly Rocks' },
        { id: 'meetings', icon: <MeetingIcon />, label: 'L10 Meetings' },
        { id: 'ai-analysis', icon: <AiIcon />, label: 'AI Analysis' },
    ];

    return (
        <nav className="w-16 md:w-64 bg-gray-950 p-2 md:p-4 flex flex-col border-r border-gray-800">
            <div className="text-2xl font-bold mb-10 hidden md:block text-indigo-400">
                OrgDNA
            </div>
            <ul className="space-y-2">
                {navItems.map(item => (
                    <li key={item.id}>
                        <button
                            onClick={() => setPage(item.id)}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                                currentPage === item.id 
                                ? 'bg-indigo-600 text-white' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span className="ml-4 hidden md:inline">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

// --- Page Components ---

const StatCard = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="bg-gray-900 p-3 rounded-full text-indigo-400">
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const getStatusColorClasses = (status) => {
    switch (status) {
        case 'On Track': return 'bg-green-500/20 text-green-400 border border-green-500/30';
        case 'Off Track': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        case 'Done': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
};

const Dashboard = ({userId}) => {
    const [stats, setStats] = useState({ departments: 0, people: 0, rocks: 0 });
    const [companyRocks, setCompanyRocks] = useState([]);
    const [individualRocks, setIndividualRocks] = useState([]);
    const [people, setPeople] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [recentMeetings, setRecentMeetings] = useState([]);

    useEffect(() => {
        const collections = {
            departments: collection(db, `/artifacts/${appId}/public/data/departments`),
            people: collection(db, `/artifacts/${appId}/public/data/people`),
            companyRocks: collection(db, `/artifacts/${appId}/public/data/companyRocks`),
            individualRocks: collection(db, `/artifacts/${appId}/public/data/individualRocks`),
            l10Meetings: query(collection(db, `/artifacts/${appId}/public/data/l10Meetings`), orderBy('date', 'desc'), limit(3))
        };

        const unsubscribers = [
            onSnapshot(collections.departments, snapshot => {
                setDepartments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()})));
                setStats(s => ({...s, departments: snapshot.size}));
            }),
            onSnapshot(collections.people, snapshot => {
                setPeople(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()})));
                setStats(s => ({...s, people: snapshot.size}));
            }),
            onSnapshot(collections.companyRocks, snapshot => setCompanyRocks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()})))),
            onSnapshot(collections.individualRocks, snapshot => setIndividualRocks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()})))),
            onSnapshot(collections.l10Meetings, snapshot => setRecentMeetings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()})))),
        ];
        
        return () => unsubscribers.forEach(unsub => unsub());
    }, [userId]);

    useEffect(() => {
        setStats(s => ({...s, rocks: companyRocks.length + individualRocks.length }));
    }, [companyRocks, individualRocks]);
    
    const getOwnerName = (ownerId) => people.find(p => p.id === ownerId)?.name || '...';
    const getDeptName = (deptId) => departments.find(d => d.id === deptId)?.name || '...';

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">Company Dashboard</h1>
            <p className="text-lg text-gray-400 mb-8">An at-a-glance report of your organization's DNA.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Departments" value={stats.departments} icon={<DepartmentIcon />} />
                <StatCard title="Total People" value={stats.people} icon={<PeopleIcon />} />
                <StatCard title="Total Rocks" value={stats.rocks} icon={<RocksIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Company Rocks</h2>
                        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                            {companyRocks.length > 0 ? companyRocks.map(rock => (
                                <div key={rock.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                                    <p className="text-gray-200">{rock.title}</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClasses(rock.status)}`}>{rock.status}</span>
                                </div>
                            )) : <p className="text-gray-500">No company rocks defined.</p>}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Individual Rocks</h2>
                        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                            {individualRocks.length > 0 ? individualRocks.map(rock => (
                                <div key={rock.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                                    <div>
                                        <p className="text-gray-200">{rock.title}</p>
                                        <p className="text-xs text-gray-400">Owner: {getOwnerName(rock.ownerId)}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClasses(rock.status)}`}>{rock.status}</span>
                                </div>
                            )) : <p className="text-gray-500">No individual rocks defined.</p>}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Recent L10 Meetings</h2>
                    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        {recentMeetings.length > 0 ? recentMeetings.map(meeting => (
                            <div key={meeting.id} className="bg-gray-900/50 p-3 rounded-md">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-200">{getDeptName(meeting.departmentId)}</h3>
                                    <p className="text-xs text-gray-500">{new Date(meeting.date).toLocaleDateString()}</p>
                                </div>
                                <p className="text-sm text-gray-400 truncate">{meeting.notes}</p>
                            </div>
                        )) : <p className="text-gray-500">No recent meetings recorded.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Vision = ({userId}) => {
    const [vision, setVision] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const visionDocRef = doc(db, `/artifacts/${appId}/public/data/vision/visionDoc`);

    useEffect(() => {
        const unsubscribe = onSnapshot(visionDocRef, (doc) => {
            if (doc.exists()) {
                setVision(doc.data().text);
            } else {
                setVision('Define your company vision here...');
            }
        });
        return () => unsubscribe();
    }, [visionDocRef]);

    const handleSave = async () => {
        try {
            await setDoc(visionDocRef, { text: vision });
            setIsEditing(false);
        } catch (e) {
            console.error("Error saving vision: ", e);
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-4">Company Vision</h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                {isEditing ? (
                    <textarea
                        className="w-full h-64 p-3 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={vision}
                        onChange={(e) => setVision(e.target.value)}
                    />
                ) : (
                    <p className="text-gray-300 whitespace-pre-wrap">{vision}</p>
                )}
                <div className="mt-4">
                    {isEditing ? (
                        <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                            Save Vision
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                            Edit Vision
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                       <XIcon />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const Departments = ({ userId }) => {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const departmentsCollectionRef = collection(db, `/artifacts/${appId}/public/data/departments`);

    useEffect(() => {
        const unsubscribe = onSnapshot(departmentsCollectionRef, (snapshot) => {
            const deptsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDepartments(deptsData);
        });
        return () => unsubscribe();
    }, []);

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        if (newDepartment.trim() === '') return;
        try {
            await addDoc(departmentsCollectionRef, { name: newDepartment.trim() });
            setNewDepartment('');
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding department: ", error);
        }
    };
    
    const handleDeleteDepartment = async (id) => {
        try {
            await deleteDoc(doc(db, `/artifacts/${appId}/public/data/departments`, id));
        } catch (error) {
            console.error("Error deleting department: ", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold text-gray-100">Departments</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusIcon/> <span className="ml-2">Add Department</span>
                </button>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Department">
                <form onSubmit={handleAddDepartment}>
                    <input
                        type="text"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                        placeholder="e.g., Marketing"
                        className="w-full p-3 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                        Add Department
                    </button>
                </form>
            </Modal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map(dept => (
                    <div key={dept.id} className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
                        <span className="text-lg text-gray-300">{dept.name}</span>
                        <button onClick={() => handleDeleteDepartment(dept.id)} className="text-red-500 hover:text-red-400">
                           <TrashIcon/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


const People = ({ userId }) => {
    const [people, setPeople] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newName, setNewName] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const peopleCollectionRef = collection(db, `/artifacts/${appId}/public/data/people`);
    const departmentsCollectionRef = collection(db, `/artifacts/${appId}/public/data/departments`);

    useEffect(() => {
        const unsubPeople = onSnapshot(peopleCollectionRef, snapshot => {
            const peopleData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPeople(peopleData);
        });
        const unsubDepts = onSnapshot(departmentsCollectionRef, snapshot => {
            const deptsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDepartments(deptsData);
            if (deptsData.length > 0 && !selectedDept) {
                setSelectedDept(deptsData[0].id);
            }
        });
        return () => {
            unsubPeople();
            unsubDepts();
        };
    }, []);
    
    const handleAddPerson = async (e) => {
        e.preventDefault();
        if (newName.trim() === '' || selectedDept === '') return;
        try {
            await addDoc(peopleCollectionRef, { name: newName.trim(), departmentId: selectedDept });
            setNewName('');
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding person: ", error);
        }
    };

    const handleDeletePerson = async (id) => {
        try {
            await deleteDoc(doc(db, `/artifacts/${appId}/public/data/people`, id));
        } catch (error) {
            console.error("Error deleting person: ", error);
        }
    };
    
    const getDepartmentName = (deptId) => {
        const dept = departments.find(d => d.id === deptId);
        return dept ? dept.name : 'Unassigned';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold text-gray-100">People</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusIcon/> <span className="ml-2">Add Person</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Person">
                <form onSubmit={handleAddPerson}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Person's Name"
                        className="w-full p-3 bg-gray-900 text-white rounded-md border border-gray-700 mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full p-3 bg-gray-900 text-white rounded-md border border-gray-700 mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                        Add Person
                    </button>
                </form>
            </Modal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {people.map(person => (
                    <div key={person.id} className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
                       <div>
                            <p className="text-lg text-gray-300">{person.name}</p>
                            <p className="text-sm text-indigo-400">{getDepartmentName(person.departmentId)}</p>
                       </div>
                       <button onClick={() => handleDeletePerson(person.id)} className="text-red-500 hover:text-red-400">
                           <TrashIcon/>
                       </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Rocks = ({ userId }) => {
    const [companyRocks, setCompanyRocks] = useState([]);
    const [individualRocks, setIndividualRocks] = useState([]);
    const [people, setPeople] = useState([]);
    const [newRockTitle, setNewRockTitle] = useState('');
    const [newRockType, setNewRockType] = useState('company');
    const [newRockOwner, setNewRockOwner] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const statuses = ['On Track', 'Off Track', 'Done'];

    const companyRocksRef = collection(db, `/artifacts/${appId}/public/data/companyRocks`);
    const individualRocksRef = collection(db, `/artifacts/${appId}/public/data/individualRocks`);
    const peopleRef = collection(db, `/artifacts/${appId}/public/data/people`);

    useEffect(() => {
        const unsubCompany = onSnapshot(companyRocksRef, snapshot => {
            setCompanyRocks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubIndividual = onSnapshot(individualRocksRef, snapshot => {
            setIndividualRocks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubPeople = onSnapshot(peopleRef, snapshot => {
            const peopleData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPeople(peopleData);
            if (peopleData.length > 0 && !newRockOwner) {
                setNewRockOwner(peopleData[0].id);
            }
        });
        return () => { unsubCompany(); unsubIndividual(); unsubPeople(); };
    }, []);

    const handleAddRock = async (e) => {
        e.preventDefault();
        if (newRockTitle.trim() === '') return;
        const rockData = { title: newRockTitle, status: 'On Track' };
        if (newRockType === 'individual') {
            if (!newRockOwner) {
                 console.error("Please select an owner for the individual rock.");
                 return;
            }
            rockData.ownerId = newRockOwner;
            await addDoc(individualRocksRef, rockData);
        } else {
            await addDoc(companyRocksRef, rockData);
        }
        setNewRockTitle('');
        setIsModalOpen(false);
    };

    const updateRockStatus = async (id, type, status) => {
        const ref = doc(db, `/artifacts/${appId}/public/data/${type}Rocks`, id);
        await updateDoc(ref, { status });
    };

    const getOwnerName = (ownerId) => people.find(p => p.id === ownerId)?.name || 'Unknown';

    const getStatusColorBorder = (status) => {
        if (status === 'On Track') return 'border-green-500';
        if (status === 'Off Track') return 'border-yellow-500';
        if (status === 'Done') return 'border-blue-500';
        return 'border-gray-600';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-gray-100">Quarterly Rocks</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusIcon/> <span className="ml-2">Add Rock</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Rock">
                <form onSubmit={handleAddRock}>
                    <input type="text" value={newRockTitle} onChange={e => setNewRockTitle(e.target.value)} placeholder="Rock Title" className="w-full p-3 bg-gray-900 text-white rounded-md border border-gray-700 mb-4" />
                    <select value={newRockType} onChange={e => setNewRockType(e.target.value)} className="w-full p-3 bg-gray-900 text-white rounded-md border border-gray-700 mb-4">
                        <option value="company">Company Rock</option>
                        <option value="individual">Individual Rock</option>
                    </select>
                    {newRockType === 'individual' && (
                        <select value={newRockOwner} onChange={e => setNewRockOwner(e.target.value)} className="w-full p-3 bg-gray-900 text-white rounded-md border border-gray-700 mb-4">
                            {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    )}
                    <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Add Rock</button>
                </form>
            </Modal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Company Rocks</h2>
                    <div className="space-y-4">
                        {companyRocks.map(rock => (
                            <div key={rock.id} className={`bg-gray-800 p-4 rounded-lg border-l-4 ${getStatusColorBorder(rock.status)}`}>
                                <p className="text-lg text-gray-200">{rock.title}</p>
                                <select value={rock.status} onChange={e => updateRockStatus(rock.id, 'company', e.target.value)} className="bg-gray-700 text-white rounded p-1 mt-2 text-sm">
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Individual Rocks</h2>
                     <div className="space-y-4">
                        {individualRocks.map(rock => (
                            <div key={rock.id} className={`bg-gray-800 p-4 rounded-lg border-l-4 ${getStatusColorBorder(rock.status)}`}>
                                <p className="text-lg text-gray-200">{rock.title}</p>
                                <p className="text-sm text-gray-400">Owner: {getOwnerName(rock.ownerId)}</p>
                                <select value={rock.status} onChange={e => updateRockStatus(rock.id, 'individual', e.target.value)} className="bg-gray-700 text-white rounded p-1 mt-2 text-sm">
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Meetings = ({ userId }) => {
    const [meetings, setMeetings] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newMeetingDept, setNewMeetingDept] = useState('');
    const [newMeetingNotes, setNewMeetingNotes] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const meetingsRef = collection(db, `/artifacts/${appId}/public/data/l10Meetings`);
    const departmentsRef = collection(db, `/artifacts/${appId}/public/data/departments`);

    useEffect(() => {
        const q = query(meetingsRef, orderBy('date', 'desc'));
        const unsubMeetings = onSnapshot(q, snapshot => {
            setMeetings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubDepts = onSnapshot(departmentsRef, snapshot => {
            const deptsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDepartments(deptsData);
            if(deptsData.length > 0 && !newMeetingDept) setNewMeetingDept(deptsData[0].id);
        });
        return () => { unsubMeetings(); unsubDepts(); };
    }, []);

    const handleAddMeeting = async (e) => {
        e.preventDefault();
        if(newMeetingNotes.trim() === '' || !newMeetingDept) return;
        await addDoc(meetingsRef, {
            departmentId: newMeetingDept,
            notes: newMeetingNotes,
            date: new Date().toISOString()
        });
        setNewMeetingNotes('');
        setIsModalOpen(false);
    };

    const getDeptName = (deptId) => departments.find(d => d.id === deptId)?.name || 'Unknown Dept';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-gray-100">L10 Meetings</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusIcon/> <span className="ml-2">Add Meeting Record</span>
                </button>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Meeting Record">
                <form onSubmit={handleAddMeeting}>
                    <select value={newMeetingDept} onChange={e => setNewMeetingDept(e.target.value)} className="w-full p-3 bg-gray-900 text-white rounded-md border border-gray-700 mb-4">
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <textarea value={newMeetingNotes} onChange={e => setNewMeetingNotes(e.target.value)} placeholder="Meeting notes..." className="w-full h-40 p-3 bg-gray-900 text-white rounded-md border border-gray-700 mb-4" />
                    <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Add Record</button>
                </form>
            </Modal>

            <div className="space-y-4">
                {meetings.map(meeting => (
                    <div key={meeting.id} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-indigo-400">{getDeptName(meeting.departmentId)}</h3>
                            <p className="text-sm text-gray-500">{new Date(meeting.date).toLocaleDateString()}</p>
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap">{meeting.notes}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const simulatedAnalysis = `EXECUTIVE SUMMARY:

Overall, the company shows strong performance in Marketing and operational efficiency gains, but a critical risk has emerged in the Development team that jeopardizes a key company rock.

1. KEY ISSUES:
- Development Roadblock: The Unified Listing Platform V2 is at risk. The frontend UI is blocked by unexpected Webflow API rate limits, putting Marco Ruiz's rock 'Off Track'.
- Sales-Operations Dependency: A high-priority sale to BigBuild Corp is contingent on the workshop's repair schedule, highlighting a critical link between sales and repair velocity.
- Logistical Delays: A shipment of equipment from Germany is delayed, posing a potential inventory challenge.

2. DECISIONS & ACTION ITEMS:
- API Caching Strategy (Decision): Elena Vidal will pair-program with Marco Ruiz to implement a solution for the Webflow API issue.
- Repair Prioritization (Decision): The BigBuild Corp unit will be moved to the front of the repair queue.
- Image Orientation Bug (To-do): A ticket (INSP-481) has been created to fix a bug in the technical inspection tool.
- Shipment Tracking (To-do): Javier Costa is to provide hourly updates on the delayed German shipment.
- New Content Strategy (To-do): Isabella Soler will create a 3-month content calendar for the Shopify blog.

3. CROSS-MEETING THEMES:
- Inter-departmental Dependencies: The data clearly shows how Development's progress directly impacts Marketing's ability to promote new platform features, and how Operations' efficiency directly impacts Sales' ability to close deals.
- Proactive Problem Solving: Teams are effectively identifying issues and assigning clear, actionable 'To-dos' to resolve them.
`;


const AiAnalysis = ({ userId }) => {
    const [analysis, setAnalysis] = useState(simulatedAnalysis);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const callGeminiApi = async (prompt) => {
        setIsLoading(true);
        setError('');
        setAnalysis('');
    
        const apiKey = ""; // Canvas will provide key at runtime
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
        const systemPrompt = "You are an expert business management analyst specializing in the Entrepreneurial Operating System (EOS). Your task is to analyze L10 meeting notes. Provide a concise, executive-level summary. Focus on identifying key issues, decisions made, new to-dos or action items, and any recurring themes or roadblocks across all meetings. Use bullet points for clarity. Structure your response into: 1. Key Issues, 2. Decisions & Action Items, 3. Cross-Meeting Themes.";

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
    
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
                setAnalysis(text);
            } else {
                throw new Error("No content received from API.");
            }
        } catch (err) {
            console.error("Error calling Gemini API:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAnalyze = async () => {
        try {
            const meetingsRef = collection(db, `/artifacts/${appId}/public/data/l10Meetings`);
            const departmentsRef = collection(db, `/artifacts/${appId}/public/data/departments`);
            
            const deptSnapshot = await getDocs(departmentsRef);
            const departments = {};
            deptSnapshot.forEach(doc => {
                departments[doc.id] = doc.data().name;
            });

            const querySnapshot = await getDocs(meetingsRef);
            let allNotes = "Here are the recent L10 meeting notes:\n\n";
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const deptName = departments[data.departmentId] || 'Unknown Department';
                allNotes += `--- Meeting: ${deptName} on ${new Date(data.date).toLocaleDateString()} ---\n`;
                allNotes += `${data.notes}\n\n`;
            });


            if (querySnapshot.empty) {
                 setError("Not enough meeting data to analyze. Please add more meeting records.");
                 return;
            }

            callGeminiApi(allNotes);

        } catch (e) {
            console.error("Error fetching meetings for analysis: ", e);
            setError("Failed to fetch meeting data. Please try again.");
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-4">AI Analysis of L10 Meetings</h1>
            <p className="text-gray-400 mb-6">Get an AI-powered summary of key issues, decisions, and themes from your L10 meeting records.</p>
            <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center disabled:bg-indigo-800 disabled:cursor-not-allowed"
            >
                {isLoading ? <Spinner /> : <AiIcon />}
                <span className="ml-3">{isLoading ? 'Analyzing...' : 'Analyze All Meeting Records'}</span>
            </button>
            
            {error && <div className="mt-6 bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">{error}</div>}

            <div className="mt-8 bg-gray-800 p-6 rounded-lg min-h-[200px]">
                 <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Analysis Results</h2>
                 {isLoading ? (
                    <div className="flex items-center text-gray-400">
                        <Spinner /> <span className="ml-3">Generating analysis...</span>
                    </div>
                 ) : (
                    <div className="text-gray-300 whitespace-pre-wrap font-mono">{analysis || "Click the button above to generate an analysis."}</div>
                 )}
            </div>
        </div>
    );
};

