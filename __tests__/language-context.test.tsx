import { describe, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

jest.unmock('@/contexts/LanguageContext');

const { LanguageProvider, useLanguage } = require('@/contexts/LanguageContext');
const { translations } = require('@/utils/i18n');

function LanguageProbe() {
  const { t, setLang } = useLanguage();

  return (
    <>
      <Text testID="label">{t.sign_in_btn}</Text>
      <TouchableOpacity testID="switch" onPress={() => setLang('pt')} />
    </>
  );
}

describe('LanguageContext', () => {
  it('defaults to English', () => {
    const { getByTestId } = render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>
    );

    expect(getByTestId('label').props.children).toBe(translations.en.sign_in_btn);
  });

  it('switches language and persists', async () => {
    const setItemSpy = jest.spyOn(AsyncStorage, 'setItem');
    const { getByTestId } = render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>
    );

    fireEvent.press(getByTestId('switch'));

    await waitFor(() => {
      expect(getByTestId('label').props.children).toBe(translations.pt.sign_in_btn);
    });

    expect(setItemSpy).toHaveBeenCalledWith('app_language', 'pt');
  });
});
