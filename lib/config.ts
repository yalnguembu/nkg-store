import { client } from "./api/client.gen";

const apiUrl = 'http://localhost:3001';

client.setConfig({
  baseUrl: apiUrl,
});

export const config = {
  apiUrl,
  company: {
    facebookUrl: "https://www.facebook.com/p/NKG-Services-100077928075958/",
    pobox: "B.P: 4918 Douala",
    phone: "23307204496",
    phone2: "677406443",
    phone3: "697977477",
    email: "nkgservicesplus@yahoo.fr",
    email2: "georgesnguimfack@yahoo.fr",
    location: "Nouvelle route Bonadibon a cote d'EXPRESS UNION",
  }
};
