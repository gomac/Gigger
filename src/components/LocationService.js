import Geolocation from '@react-native-community/geolocation';

export const getLocation = () => {
    return new Promise(
        (resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => resolve(position.coords),
                (err) => reject(err),
                {enableHighAccuracy: false, timeout: 200000, maximumAge: 1000}
            );
        }
    )
}