import Geocode from "react-geocode";
import { MAPS_API_KEY } from '@env';

Geocode.setApiKey(MAPS_API_KEY);

export default Geocode;
