jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

if (typeof global.alert !== 'function') {
    global.alert = jest.fn();
}

jest.mock('@/contexts/LanguageContext', () => {
    const { translations } = require('./utils/i18n');
    return {
        useLanguage: () => ({
            lang: 'pt',
            setLang: jest.fn(),
            t: translations.pt,
        }),
    };
});

jest.mock('@/contexts/UserContext', () => {
    const actual = jest.requireActual('@/contexts/UserContext');
    return {
        ...actual,
        useUser: () => ({
            user: {
                name: 'Utilizador',
                email: 'utilizador@fe.up.pt',
                tag: '@user',
                bio: '',
                avatarEmoji: '🧑',
                course: 'Engenharia Informática',
            },
            updateUser: jest.fn().mockResolvedValue(undefined),
        }),
    };
});

jest.mock('@/contexts/TripTrackingContext', () => ({
    useTripTracking: jest.fn(() => ({
        activeTrip: null,
        startTrip: jest.fn(),
        stopTrip: jest.fn(),
        pauseTrip: jest.fn(),
        resumeTrip: jest.fn(),
        isTracking: false,
        locationError: null,
        clearError: jest.fn(),
    })),
}));

jest.mock('@/contexts/TripsContext', () => {
    const React = require('react');
    const TripsContext = React.createContext({
        trips: [] as any[],
        tripsCount: 0,
        addTrip: (trip: any) => {},
    });

    const TripsProvider = ({ children }: { children: any }) => {
        const [trips, setTrips] = React.useState([] as any[]);
        const addTrip = React.useCallback((trip: any) => {
            setTrips((prev: any[]) => [trip, ...prev]);
        }, []);
        return React.createElement(
            TripsContext.Provider,
            { value: { trips, tripsCount: trips.length, addTrip } },
            children
        );
    };

    const useTrips = () => React.useContext(TripsContext);

    return {
        TripsProvider,
        useTrips,
    };
});

jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        back: jest.fn(),
    },
    useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn(() =>
        Promise.resolve({ granted: true })
    ),
    watchPositionAsync: jest.fn(() =>
        Promise.resolve({
            remove: jest.fn(),
        })
    ),
    getCurrentPositionAsync: jest.fn(() =>
        Promise.resolve({
            coords: {
                latitude: 41.14858,
                longitude: -8.610945,
                accuracy: 5,
            },
        })
    ),
}));
