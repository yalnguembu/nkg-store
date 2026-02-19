import { client } from "./api/client.gen";

const apiUrl = "http://localhost:3001";

client.setConfig({
  baseUrl: apiUrl,
});

export const config = {
  apiUrl,
  company: {
    facebookUrl: "https://www.facebook.com/p/NKG-services-100063761185251/",
    pobox: "B.P: 4918 Douala",
    phone: "243724496",
    phone2: "677406343",
    phone3: "697977477",
    email: "nkgservices@yahoo.fr",
    email2: "georgesnguimfack@yahoo.fr",
    location: "Nouvelle route Bonadibon en face de l'Ecole HORIZON",
  },
};
