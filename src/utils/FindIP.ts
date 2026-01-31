import axios from "axios";

export const IpApi = async (ipAddress) => {
  let ret = {
    country: null,
    region: null,
    city: null,
  };
  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    if (data.status === "success") {
      // country = data.country;
      // region = data.regionName;
      // city = data.city;
      ret = {...ret, country: data?.country, region: data?.regionName, city: data?.city};
    }
  } catch (error) {
    console.error(`Erro ao buscar localização: [http://ip-api.com/json/${ipAddress}]`, error);
  }

  return ret;
}
