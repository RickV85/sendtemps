import GoogleMapReact from 'google-map-react';

interface Props {
  text: string,
  lat: number,
  lng: number,
}

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const AnyReactComponent = ({ text }: Props) => <div>{text}</div>;

export default function Map(){
  const defaultProps = {
    center: {
      lat: 40,
      lng: -105.4
    },
    zoom: 10
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={40}
          lng={-105.4}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
}