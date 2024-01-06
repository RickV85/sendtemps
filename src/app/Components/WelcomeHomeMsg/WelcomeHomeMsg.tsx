import { useSession } from "next-auth/react";

export const WelcomeHomeMsg = () => {
  const { data: session, status } = useSession();
  return (
    <div className="home-welcome-msg-div">
      <h2 className="home-welcome-header">Welcome to SendTemps!</h2>
      {status === "authenticated" ? null : (
        <>
          <p>
            <strong>
              Log in with Google by clicking the &ldquo;Sign in!&rdquo; button
              in the upper right corner to add your own favorite locations!
            </strong>
          </p>
          <br />
        </>
      )}
      <p>
        Select Climbing, Mountain Biking, or Skiing/Snowboarding above, then
        choose a location to get highly-accurate, NOAA pinpoint forecasts.
        <br />
        <br />
        In my experience over the last decade, NOAA&apos;s pinpoint forecasts
        have proven to be far more accurate for backcountry destinations when
        compared to the average weather app. So I decided to build this
        straight-forward, ad-free app for my fellow Front-Rangers to easily get
        an accurate forecast for their own backcountry adventures!
        <br />
        <br />
        New features are coming soon! If you have feedback or feature
        suggestions, please email me at rickv85@gmail.com.
      </p>
    </div>
  );
};
