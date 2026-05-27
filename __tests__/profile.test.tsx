import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import ProfileScreen from '../app/profile';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('@/services/auth.service', () => ({
  signOutUser: jest.fn().mockResolvedValue(undefined),
}));

const mockUpdateUser = jest.fn().mockResolvedValue(undefined);

jest.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: {
      name: 'Test User',
      email: 'test@example.com',
      tag: '@test',
      bio: '',
      avatarEmoji: ':)',
      course: 'LEIC',
    },
    updateUser: mockUpdateUser,
  }),
}));

jest.mock('@/contexts/LanguageContext', () => {
  const { translations } = require('@/utils/i18n');
  return {
    useLanguage: () => ({
      t: translations.en,
      lang: 'en',
      setLang: jest.fn(),
    }),
  };
});

const getStrings = () => require('@/utils/i18n').translations.en;

describe('ProfileScreen acceptance tests', () => {
  it('renders user info and menu items', () => {
    const t = getStrings();
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('@test')).toBeTruthy();
    expect(getByText('LEIC')).toBeTruthy();
    expect(getByText(t.manage_account)).toBeTruthy();
    expect(getByText(t.invite_to_app)).toBeTruthy();
    expect(getByText(t.invite_to_challenge)).toBeTruthy();
  });

  it('validates empty name before saving', () => {
    const t = getStrings();
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<ProfileScreen />);

    fireEvent.press(getByText(t.manage_account));
    fireEvent.changeText(getByPlaceholderText(t.name_label), '');
    fireEvent.press(getByText(t.save_btn));

    expect(alertSpy).toHaveBeenCalledWith(t.error, t.name_empty);
    alertSpy.mockRestore();
  });

  it('opens invite modals and validates empty emails', () => {
    const t = getStrings();
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText, getAllByPlaceholderText } = render(<ProfileScreen />);

    fireEvent.press(getByText(t.invite_to_app));
    fireEvent.press(getByText(t.send_btn));
    expect(alertSpy).toHaveBeenCalledWith(t.error, t.insert_email);
    fireEvent.press(getByText(t.cancel));

    fireEvent.press(getByText(t.invite_to_challenge));
    fireEvent.press(getByText(t.send_btn));
    expect(alertSpy).toHaveBeenCalledWith(t.error, t.insert_email);

    alertSpy.mockRestore();
    expect(getAllByPlaceholderText('email@exemplo.com').length).toBeGreaterThan(0);
  });

  it('saves profile changes and shows success alert', async () => {
    const t = getStrings();
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<ProfileScreen />);

    fireEvent.press(getByText(t.manage_account));
    fireEvent.changeText(getByPlaceholderText(t.name_label), 'New Name');
    fireEvent.press(getByText(t.save_btn));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith(t.saved_title, t.profile_updated);
    });

    alertSpy.mockRestore();
  });

  it('logs out after confirmation', async () => {
    const t = getStrings();
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText } = render(<ProfileScreen />);

    fireEvent.press(getByText(t.sign_out));

    const buttons = alertSpy.mock.calls[0][2] as Array<{ text: string; onPress?: () => void }>;
    const okButton = buttons.find((btn) => btn.text === t.sign_out_confirm_ok);
    okButton?.onPress?.();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
    alertSpy.mockRestore();
  });
});
