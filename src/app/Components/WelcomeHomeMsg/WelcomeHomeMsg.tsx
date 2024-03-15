import { UserContext } from "@/app/Contexts/UserContext";
import { useContext } from "react";

export const WelcomeHomeMsg = () => {
  const { userInfo } = useContext(UserContext);

  return (
    <div className="home-welcome-msg-div">
      {userInfo === undefined ? (
        <div className="home-loading-msg">
          <p>Please wait, loading...</p>
        </div>
      ) : (
        <h2 className="home-welcome-header">Welcome to SendTemps!</h2>
      )}
      {userInfo === undefined ? null : (
        <div className="home-welcome-content">
          {!userInfo ? (
            <>
              <p>
                <strong>
                  Log in with Google by clicking the &ldquo;Sign in!&rdquo;
                  button in the upper right corner to add your own favorite
                  locations!
                </strong>
              </p>
              <br />
            </>
          ) : null}
          <p>
            Select a location to view highly-accurate, NOAA pinpoint forecasts
            for your backcountry adventures!
            <br />
            <br />
            {userInfo ? (
              <>
                Click the &ldquo;Edit Locations&rdquo; button in the upper left
                corner to add a new custom location or edit an existing custom
                location.
                <br />
                <br />
              </>
            ) : null}
            In my experience over the last decade, NOAA&apos;s pinpoint
            forecasts have proven to be far more accurate for backcountry
            destinations when compared to the average weather app. So I decided
            to build this straight-forward, ad-free app for my fellow
            Front-Rangers to easily get an accurate forecast for their own
            backcountry adventures!
            <br />
            <br />
            New features are coming soon! If you have feedback or feature
            suggestions, please email me at rickv85@gmail.com.
          </p>
        </div>
      )}
    </div>
  );
};
