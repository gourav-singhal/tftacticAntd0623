import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import deDe from 'antd/lib/locale/de_DE';
import enUS from 'antd/lib/locale/en_US';
import GlobalStyle from './styles/GlobalStyle';
import 'typeface-montserrat';
import 'typeface-lato';
import { AppRouter } from './components/router/AppRouter';
import { useLanguage } from './hooks/useLanguage';
import { useAutoNightMode } from './hooks/useAutoNightMode';
import { usePWA } from './hooks/usePWA';
import { useThemeWatcher } from './hooks/useThemeWatcher';
import { useAppSelector } from './hooks/reduxHooks';
import { themeObject } from './styles/themes/themeVariables';
import { useAppDispatch } from './hooks/reduxHooks';
import { getChampionsData } from './store/slices/championsSlice';
import { getItemsData } from './store/slices/itemsSlice';
import { getSynergysData } from './store/slices/synergysSlice';
import { getTeamCompsData } from './store/slices/teamCompsSlice';
import { useSelector } from "react-redux";
import { RootState } from './store/store';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getChampionsData());
    dispatch(getItemsData());
    dispatch(getSynergysData());
    dispatch(getTeamCompsData());
  }, []);
  const { language } = useLanguage();
  const theme = useAppSelector((state) => state.theme.theme);

  usePWA();

  useAutoNightMode();

  useThemeWatcher();

  return (
    <>
      <meta name="theme-color" content={themeObject[theme].primary} />
      <GlobalStyle />
      <HelmetProvider>
        <ConfigProvider locale={language === 'en' ? enUS : deDe}>
          <AppRouter />
        </ConfigProvider>
      </HelmetProvider>
    </>
  );
};

export default App;
