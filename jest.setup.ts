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
