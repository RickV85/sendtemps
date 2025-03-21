'use client';
import { throttle } from 'lodash';
import { useEffect, useRef, useContext, useCallback, useState } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { HomeContext } from './Contexts/HomeContext';
import DetailedDayForecast from './Components/DetailedDayForecast/DetailedDayForecast';
import HomeHeader from './Components/HomeHeader/HomeHeader';
import HomeControl from './Components/HomeControl/HomeControl';
import ReloadBtn from './Components/ReloadBtn/ReloadBtn';
import { WelcomeHomeMsg } from './Components/WelcomeHomeMsg/WelcomeHomeMsg';
import HourlyForecastContainer from './Components/HourlyForecastContainer/HourlyForecastContainer';
import PullToRefreshContent from './Components/PullToRefreshContent/PullToRefreshContent';
import './home.css';

export default function Home() {
  const {
    selectedLocType,
    forecastData,
    setForecastData,
    hourlyForecastParams,
    forecastSendScores,
    screenWidth,
    setScreenWidth,
    isLoading,
    pageLoaded,
    setPageLoaded,
    error,
  } = useContext(HomeContext);
  const forecastSection = useRef<null | HTMLElement>(null);
  const [hasSeenHourlyForecast, setHasSeenHourlyForecast] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const hasForecastData = !!forecastData;

  useEffect(() => {
    // Set pageLoaded using readyState listener
    if (document.readyState === 'complete') {
      setPageLoaded(true);
      if ('ontouchstart' in window) {
        setIsTouchDevice(true);
      }
    } else {
      window.addEventListener('load', () => setPageLoaded(true));
    }

    return () => {
      window.removeEventListener('load', () => setPageLoaded(true));
    };
  }, [setPageLoaded]);

  // Unregister service worker in production, no longer used.
  // Was causing issues with caching network requests
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => {
            for (let registration of registrations) {
              registration.unregister().then((res) => {
                if (res === true) {
                  console.log('Service Worker unregistered successfully');
                }
              });
            }
          })
          .catch((error) => {
            console.error('Service Worker unregistration failed:', error);
          });
      });
    }
  }, []);

  // SetScreen width with throttling
  useEffect(() => {
    const setWindowWidthState = throttle(() => {
      setScreenWidth(window.innerWidth);
    }, 100);

    setWindowWidthState();
    window.addEventListener('resize', setWindowWidthState);

    return () => window.removeEventListener('resize', setWindowWidthState);
  }, [setScreenWidth]);

  // Toggle loading class on forecast section -
  // prevents layout shift while loading new daily forecast
  useEffect(() => {
    if (isLoading) {
      forecastSection.current?.classList.add('loading');
    } else {
      forecastSection.current?.classList.remove('loading');
    }
  }, [isLoading]);

  // Get localStorage item and set state indicating if user
  // has seen the new hourly forecast feature
  useEffect(() => {
    const hasSeenHourly = window.localStorage.getItem('hasSeenHourly');
    if (!hasSeenHourly || hasSeenHourly === 'false') {
      setHasSeenHourlyForecast(false);
    } else if (hasSeenHourly === 'true') {
      setHasSeenHourlyForecast(true);
    }
  }, []);

  // Set state and session storage if user views hourly forecast
  useEffect(() => {
    if (hourlyForecastParams && !hasSeenHourlyForecast) {
      setHasSeenHourlyForecast(true);
      window.localStorage.setItem('hasSeenHourly', 'true');
    }
  }, [hourlyForecastParams, hasSeenHourlyForecast]);

  const handleRefresh = () =>
    new Promise<void>((resolve) => {
      resolve(setForecastData(undefined));
    });

  // Creates detailed daily forecast display
  const createDetailedForecast = () => {
    if (forecastData) {
      const forecast = forecastData?.periods.map((period, i) => {
        return <DetailedDayForecast period={period} key={`forecastPeriod-${i}`} />;
      });
      return forecast;
    }
  };

  return (
    <main className="home-main">
      <PullToRefresh
        isPullable={pageLoaded && isTouchDevice && hasForecastData}
        onRefresh={handleRefresh}
        pullingContent={<PullToRefreshContent />}
      >
        <>
          <HomeHeader />
          <section className="home-main-section">
            {pageLoaded && screenWidth <= 768 ? <HomeControl /> : null}
            <section className="forecast-section" ref={forecastSection}>
              {isLoading ? (
                <div className="loading-msg-div">
                  <p className="loading-msg">Loading forecast...</p>
                </div>
              ) : null}
              {error && !isLoading ? (
                <div className="loading-msg-div">
                  <p className="error-msg">{`Oh, no! ${error}`}</p>
                  <ReloadBtn />
                </div>
              ) : null}
              {!forecastData && !isLoading && !error ? <WelcomeHomeMsg /> : null}
              {hourlyForecastParams && <HourlyForecastContainer />}
              {forecastData && !hourlyForecastParams ? (
                <>
                  {forecastSendScores?.summary ? (
                    <div className="send-score-summary">
                      <p>{forecastSendScores?.summary}</p>
                    </div>
                  ) : (
                    !error &&
                    selectedLocType !== 'other' &&
                    selectedLocType !== 'Current Location' && (
                      <div className="send-score-summary loading">
                        <p>Loading SendScore™ analysis...</p>
                      </div>
                    )
                  )}
                  {!hasSeenHourlyForecast && !error && (
                    <p className="hour-forecast-tip">Click on a day for an hourly forecast!</p>
                  )}
                  <div className="day-forecast-container">{createDetailedForecast()}</div>
                </>
              ) : null}
              {!isTouchDevice && hasForecastData && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <ReloadBtn id="RefreshForecastBtn" label="Refresh Forecast" onClick={handleRefresh} />
                </div>
              )}
            </section>
          </section>
        </>
      </PullToRefresh>
    </main>
  );
}
